import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const TrailersSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-16'>
      <div className='max-w-[960px] mx-auto flex items-center justify-between'>
        <p className='text-gray-300 font-medium text-lg'>Trailers</p>
        <p className='text-primary text-xs font-semibold uppercase tracking-wider'>{currentTrailer.title}</p>
      </div>

      <div className='relative mt-6'>
        <BlurCircle top='-100px' right='-100px'/>
        <ReactPlayer
          url={currentTrailer.videoUrl}
          controls={true}
          className="mx-auto max-w-full rounded-xl overflow-hidden shadow-2xl"
          width="960px"
          height="540px"
        />
      </div>

      <div className='group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>
        {dummyTrailers.map((trailer)=>(
            <div
              key={trailer.title}
              className={`relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-28 md:h-36 rounded-lg overflow-hidden cursor-pointer ${
                currentTrailer.videoUrl === trailer.videoUrl ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''
              }`}
              onClick={()=> setCurrentTrailer(trailer)}
            >
                <img
                  src={trailer.image}
                  alt={trailer.title}
                  onError={(e) => { e.currentTarget.src = '/movies/ramayana.jpg'; }}
                  className='rounded-lg w-full h-full object-cover brightness-75'
                />
                <PlayCircleIcon strokeWidth={1.6} className="absolute top-1/2 left-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg"/>
            </div>
        ))}
      </div>
    </div>
  )
}

export default TrailersSection
