import React from 'react'
import HeroSection from './HeroSection'
import Category from './Category'
import DealOfTheDay from './DealOfTheDay'
import NewArrival from './NewArrival'
import Featured from './Featured'
import Info from './Info'
import Trending from './Trending'


const Home = () => {
  return (
    <>
    <HeroSection/>
    <Category/>
    <DealOfTheDay/>
    <NewArrival/>
    <Featured/>
    <Info/>
    {/* <Trending/> */}
    </>
  )
}

export default Home