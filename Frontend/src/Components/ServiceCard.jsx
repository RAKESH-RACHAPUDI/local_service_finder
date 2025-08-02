import {useNavigate} from 'react-router-dom'

const ServiceCard=()=>{
    const navigate = useNavigate();
    return(
<>
<div
onClick={()=>navigate(`/service/service/${ServiceCard._id}`)}
className="bg-white p-4 shadow-lg rounded-2xl hover:shadow-xl transition-all cursor-pointer"
>
<image src ={ServiceCard.image || '/default-service.ipg'}
alt={ServiceCard.name}
className="w-full h-40 object-cover rounded-xl mb-3"
/>
<h2 className="text-xl font-semibold">{service.name}</h2>
<p className="text-gray-600">{service.category}</p>
<div className='mt-2 flex items-center justify-between'>
    <span  className='text-yellow-500 font-bold'>⭐ {service.rating}</span>
    <button className='bg-blue-500 text-white px-3 py-1 rounded-lg text-sm'> View Details</button>
</div>
</div>



</>
    )
}
export default ServiceCard