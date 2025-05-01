import { Link, useLocation } from 'wouter';

const MobileNavigation = () => {
  const [location] = useLocation();
  
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center ${location === '/' ? 'text-primary-600' : 'text-gray-500'}`}>
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <button className="flex flex-col items-center text-gray-500">
          <i className="fas fa-search text-lg"></i>
          <span className="text-xs mt-1">Explore</span>
        </button>
        
        <Link href="/saved">
          <a className={`flex flex-col items-center ${location === '/saved' ? 'text-primary-600' : 'text-gray-500'}`}>
            <i className="fas fa-bookmark text-lg"></i>
            <span className="text-xs mt-1">Saved</span>
          </a>
        </Link>
        
        <button className="flex flex-col items-center text-gray-500">
          <i className="fas fa-user-circle text-lg"></i>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
