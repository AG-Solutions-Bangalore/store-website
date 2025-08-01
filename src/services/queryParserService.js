import botResponses from "../config/botResponses.json";

const calculateSimilarity = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  
  const matrix = [];
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return 1 - (matrix[len1][len2] / Math.max(len1, len2));
};

const isGreeting = (query) => {
  const greetings = [
    'hello', 'hi', 'hey', 'greetings', 'good morning', 
    'good afternoon', 'good evening', 'sup', 'yo'
  ];
  return greetings.some(g => query.toLowerCase().includes(g));
};

export const parseUserQuery = (query, products) => {

  if (isGreeting(query)) {
    return {
      responseMessage: getRandomResponse(botResponses.greetings.responses),
      followUpQuestions: botResponses.greetings.followUps,
      fuzzyMatch: false
    };
  }


  const categories = [...new Set(products.map(p => p.category_names))];
  

  const filters = {
    keywords: [],
    categories: [],
    priceRange: { min: 0, max: Infinity },
    responseMessage: '',
    followUpQuestions: [],
    fuzzyMatch: false
  };


  const normalizedQuery = query.toLowerCase().trim();
  
  
  filters.keywords = normalizedQuery.split(/\s+/)
    .filter(word => word.length > 2 || /₹|\d+/.test(word));

 
  const priceMatches = normalizedQuery.match(/(under|below|less than|upto|max)\s*₹?\s*(\d+)/i) || 
                      normalizedQuery.match(/(\d+)\s*(and below|or less|below|under)/i) ||
                      normalizedQuery.match(/₹\s*(\d+)/i) ||
                      normalizedQuery.match(/(?:rs|inr)\.?\s*(\d+)/i);
  
  if (priceMatches) {
    const maxPrice = parseFloat(priceMatches[2] || priceMatches[1]);
    filters.priceRange.max = maxPrice;
    filters.responseMessage = `Showing products under ₹${maxPrice}`;
  }


  filters.categories = categories.filter(category => {
    const categoryLower = category.toLowerCase();
    

    if (filters.keywords.some(keyword => categoryLower.includes(keyword))) {
      return true;
    }
    
   
    const bestMatch = filters.keywords.find(keyword => {
      const similarity = calculateSimilarity(keyword, categoryLower);
      return similarity > 0.7; 
    });
    
    if (bestMatch) {
      filters.fuzzyMatch = true;
      return true;
    }
    
    return false;
  });

 
  if (filters.categories.length > 0) {
    filters.responseMessage = `Showing ${filters.categories.join(', ')} products`;
    if (filters.priceRange.max < Infinity) {
      filters.responseMessage += ` under ₹${filters.priceRange.max}`;
    }
    if (filters.fuzzyMatch) {
      filters.responseMessage += ` (including similar items)`;
    }
  } else {
    filters.responseMessage = `Showing products matching "${query}"`;
    if (filters.priceRange.max < Infinity) {
      filters.responseMessage += ` under ₹${filters.priceRange.max}`;
    }
    if (filters.fuzzyMatch) {
      filters.responseMessage += ` (including similar items)`;
    }
  }


  if (filters.categories.length > 0) {
    filters.followUpQuestions = filters.categories.flatMap(category => 
      botResponses.suggestions.category.map(q => 
        q.replace('{category}', category)
      )
    ).slice(0, 3);
    
    if (filters.priceRange.max < Infinity) {
      const lowerPrice = Math.floor(filters.priceRange.max / 2);
      filters.followUpQuestions.push(
        ...botResponses.suggestions.price.map(q => 
          q.replace('{price}', lowerPrice)
        ).slice(0, 1)
      );
    }
  } else if (filters.priceRange.max < Infinity) {
    const lowerPrice = Math.floor(filters.priceRange.max / 2);
    filters.followUpQuestions = botResponses.suggestions.price.map(q => 
      q.replace('{price}', lowerPrice)
    ).slice(0, 2);
    
    filters.followUpQuestions.push("Show best selling products");
  } else {
    filters.followUpQuestions = botResponses.greetings.followUps;
  }

  return filters;
};

export const applyProductFilters = (products, filters) => {
  return products.filter(product => {

    if (filters.categories.length > 0) {
      const categoryMatch = filters.categories.some(category => {
        const productCategory = product.category_names.toLowerCase();
        return productCategory.includes(category.toLowerCase()) || 
               calculateSimilarity(productCategory, category.toLowerCase()) > 0.7;
      });
      if (!categoryMatch) return false;
    }
    
 
    const price = parseFloat(product.product_selling_price);
    if (price < filters.priceRange.min || price > filters.priceRange.max) {
      return false;
    }
    
    
    if (filters.keywords.length > 0) {
      const productName = product.product_name.toLowerCase();
      const productCategory = product.category_names.toLowerCase();
      
      const keywordMatch = filters.keywords.some(keyword => {
      
        if (productName.includes(keyword) || productCategory.includes(keyword)) {
          return true;
        }
        
    
        if (calculateSimilarity(productName, keyword) > 0.6) {
          return true;
        }
        
    
        if (calculateSimilarity(productCategory, keyword) > 0.6) {
          return true;
        }
        
        return false;
      });
      
      if (!keywordMatch) return false;
    }
    
    return true;
  });
};

const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};