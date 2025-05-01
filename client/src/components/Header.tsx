import { Link } from 'wouter';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-md flex items-center justify-center">
                  <i className="fas fa-dice text-white"></i>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">HobbyQuest</span>
              </a>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/saved">
              <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition">
                <i className="fas fa-bookmark mr-2"></i>
                Saved Challenges
              </a>
            </Link>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition">
              <i className="fas fa-user-circle mr-2"></i>
              Profile
            </button>
          </div>
          
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
