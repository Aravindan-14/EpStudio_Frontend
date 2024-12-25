import React from 'react'

function Feedback() {
  return (
    <div className='container mx-auto p-5 py-10'>
      <h1 className='text-[50px] font-bold text-center py-5'>Feedback</h1>
    <div className='grid gap-5 grid-cols-1 md:grid-cols-3 '>
        <div className='bg-gray-200 p-5 rounded-md'>
          <div className='flex items-center gap-3 mb-2 '><div className=' rounded-full h-8 w-8 bg-black'><img className='overflow-hidden object-contain rounded-full' src="p.jpg" alt="" /></div><h1 className='text-xl font-semibold'>Aravindan</h1></div>
          <small className='mt-5 my-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum facere eaque libero iure at provident similique repudiandae, officiis dolorem quisquam obcaecati explicabo, quia quos aspernatur iusto, dolores distinctio pariatur optio.</small>
        </div>
        <div className='bg-gray-200 p-5 rounded-md'>
          <div className='flex items-center gap-3 mb-2 '><div className=' rounded-full h-8 w-8 bg-black'><img className='overflow-hidden object-contain rounded-full' src="p.jpg" alt="" /></div><h1 className='text-xl font-semibold'>Aravindan</h1></div>
          <small className='mt-5 my-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum facere eaque libero iure at provident similique repudiandae, officiis dolorem quisquam obcaecati explicabo, quia quos aspernatur iusto, dolores distinctio pariatur optio.</small>
        </div>
        <div className='bg-gray-200 p-5 rounded-md'>
          <div className='flex items-center gap-3 mb-2 '><div className=' rounded-full h-8 w-8 bg-black'><img className='overflow-hidden object-contain rounded-full' src="p.jpg" alt="" /></div><h1 className='text-xl font-semibold'>Aravindan</h1></div>
          <small className='mt-5 my-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum facere eaque libero iure at provident similique repudiandae, officiis dolorem quisquam obcaecati explicabo, quia quos aspernatur iusto, dolores distinctio pariatur optio.</small>
        </div>
    </div>
    </div>
  )}

export default Feedback