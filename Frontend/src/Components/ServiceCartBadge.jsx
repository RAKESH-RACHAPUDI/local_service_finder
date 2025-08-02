const ServiceCardBage = ()=>{
  const bookedCount = useSelector((state)=>state.cart.count);



    return(
        <>
        <div className="relative">
    <img src="/cart-icon.svg" alt=" Cart" className="w-8 h-8" />
    {bookedCount > 0 &&(
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {bookedCount}

        </span>
    )}


        </div>
        
        
        </>
    );
};
export default ServiceCardBage;