const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-md flex items-center justify-center">
                <i className="fas fa-bolt text-white"></i>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ChallengeGen</span>
            </div>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center text-sm text-gray-500 md:text-left">
              &copy; {new Date().getFullYear()} ChallengeGen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
