import React from 'react'

function Feedback() {
    return (
        <div className='container mx-auto p-5 py-10'>
            <h1 className='text-[50px] font-bold text-center py-5'>Feedback</h1>
            {/* <div className='grid gap-5 grid-cols-1 md:grid-cols-3 '>
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
    </div> */}

            <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div class="flex flex-wrap gap-4">
                    <div className='bg-slate-200 p-2 rounded-xl'>
                        <div className='flex gap-2 justify-between mb-2'>
                            <div className='flex gap-2'>
                                <div className='h-6 w-6 rounded-full bg-black'><img src="" alt="" /> </div><h3>Aravind</h3>
                            </div>
                            <div>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                        </div>
                        <p className='text-sm pl-2'>i Reacly like this website </p>
                    </div>
                    <div className='bg-slate-200 p-2 rounded-xl'>
                        <div className='flex  justify-between mb-2'>
                            <div className='flex gap-2'>
                                <div className='h-6 w-6 rounded-full bg-black'><img src="" alt="" /> </div><h3>Aravind</h3>
                            </div>
                            <div >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`${star <= 3 ? "text-[#FFBA18]" : "text-gray-400"
                                            }`}
                                    >
                                        <i class={`fa-sharp fa-${star <= 3 ? "solid":"regular"} fa-star`}></i>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className='text-sm pl-2'>i Reacly like tsfsfsfsfsfsfsdfsdfsdhis website </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feedback