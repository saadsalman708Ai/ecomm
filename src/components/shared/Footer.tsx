import { LOGO_TEXT } from '../../config/branding';

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-border py-8 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-sm text-foreground-muted gap-4 text-center md:text-left">
        <div>
          &copy; {new Date().getFullYear()} {LOGO_TEXT}. All rights reserved.
        </div>
        <div>
          Powered by <span className="font-semibold">saad salman 708</span> (saadsalman708)
        </div>
      </div>
    </footer>
  );
};
