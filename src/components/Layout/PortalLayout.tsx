import { Outlet } from 'react-router-dom';

const PortalLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-primary/30 selection:text-white">
      {/* Background ambient light effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;
