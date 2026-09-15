import React, { useState } from 'react';
import udeLogo from '@/assets/udeLogo.png';
import prime_twitter from '@/assets/prime_twitter.png';
import ic_mail from '@/assets/ic_mail.png';
import ic_phone from '@/assets/ic_phone.png';
import icons_insta from '@/assets/icons_insta.png';
import { NavLink } from 'react-router-dom';
import { useSubscribeToNewsletter } from '@/hooks/useApi';
import { toast } from 'react-toastify';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const subscribeMutation = useSubscribeToNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Can't submit an empty input field");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      const message = await subscribeMutation.mutateAsync(trimmed);
      toast.success(message || "You're subscribed!");
      setEmail('');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <footer className='flex flex-col'>
      {/* Section 1 */}
      <div className="bg-[url(./assets/bgFooter.png)] bg-no-repeat bg-cover">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <h2 className="font-manrope font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#FFFFFF] uppercase tracking-wide text-center mb-6">
                Join our newsletter to <br className="hidden sm:block" /> keep up to date with us!
              </h2>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-4 md:gap-6"
              >
                <div className="w-full sm:flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="w-full h-13 px-6 py-3.5 bg-transparent text-[#FFFFFF] placeholder-white/60 border-b border-[rgba(255,255,255,0.24)] focus:outline-none focus:border-[#00D46A] transition-colors"
                  />
                  {error && (
                    <p className="text-[#f56565] text-sm mt-1 text-left">
                      {error}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="
                    w-full sm:w-auto min-w-35 h-11.25 px-3 bg-[#00D46A] rounded-md text-[#FFFFFF] font-manrope font-medium text-sm flex items-center justify-center transition-all duration-200 shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C] hover:bg-[#00c45e] hover:shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C,0_4px_12px_rgba(0,212,106,0.3)]
                    active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {subscribeMutation.isPending ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className='bg-[#060A0F]'>
        <div className='container mx-auto w-11/12 py-8'>
          <div className='flex flex-col gap-8'>
            {/* Top row: logo and links */}
            <div className='flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4'>
              <div className='flex flex-col justify-start items-start gap-2'>
                <img className='w-9 h-11.75' src={udeLogo} alt="udeLogo" />
                <p className='font-manrope font-bold text-[12px] text-[#FFFFFF] text-center tracking-1 leading-4 max-w-35'>
                  Uche Dominic Egbukwu Sports Management Ltd
                </p>
              </div>

              <div className='flex flex-col sm:flex-row justify-start items-start gap-14 sm:gap-10 lg:gap-16 w-full md:w-auto'>
                
               <div className='flex flex-row justify-center items-center gap-10 '>
                   <div className='flex flex-col justify-center items-start gap-10'>
                  <h3 className='font-manrope font-bold text-[18px] md:text-[20px] text-[#FFFFFF] tracking-1 leading-0'>Platform</h3>
                  <span className='flex flex-col justify-center items-start gap-8'>
                    <NavLink to={"/players"} className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>Players
                    </NavLink>
                    <button className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>News</button>
                    <button className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>Gallery</button>
                  </span>
                </div>
                <div className='flex flex-col justify-center items-start gap-10'>
                  <h3 className='font-manrope font-bold text-[18px] md:text-[20px] text-[#FFFFFF] tracking-1 leading-0'>Academy</h3>
                  <span className='flex flex-col justify-center items-start gap-8'>
                    <button className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>U-17 Programme</button>
                    <button className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>U-20 Programme</button>
                    <button className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>U-23 Programme</button>
                  </span>
                </div>
               </div>

                <div className='flex flex-col justify-center items-start gap-10'>
                  <h3 className='font-manrope font-bold text-[18px] md:text-[20px] text-[#FFFFFF] tracking-1 leading-0'>Contact</h3>
                  <span className='flex flex-col justify-center items-start gap-8'>
                    <button className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>Lagos Office</button>
                    <button className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>Abuja Office</button>
                    <button className='font-manrope font-regular text-[14px] text-[#68717D] tracking-1 leading-0 cursor-pointer hover:text-[#00D46A] transition-colors'>Send Message</button>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className='flex flex-col md:flex-row justify-between items-center gap-10 border-t border-[rgba(255,255,255,0.24)] pt-6'>
              <p className='font-manrope font-regular text-[14px] md:text-[16px] text-[#FFFFFFCC] tracking-1 leading-0'>
                © 2026 UdeSport Management Ltd.
              </p>
              <div className='flex flex-col justify-center items-start gap-6'>
                <span className='flex flex-row justify-center items-center gap-10'>
                  <p className='font-manrope font-regular text-[14px] md:text-[16px] text-[#FFFFFFCC] tracking-1 leading-0'>Terms of Service</p>
                  <p className='font-manrope font-regular text-[14px] md:text-[16px] text-[#FFFFFFCC] tracking-1 leading-0'>Privacy Policy</p>
                </span>
                <p className='font-manrope font-regular text-[14px] md:text-[16px] text-[#FFFFFFCC] tracking-1 leading-0'>Cookies</p>
              </div>
              
              <div className='flex justify-center items-start md:items-center gap-3'>
                <button className='bg-transparent border-none cursor-pointer transition-transform hover:scale-110 focus:outline-none' onClick={() => console.log('Twitter clicked')} aria-label="Twitter">
                  <img className='w-5 h-5 md:w-6 md:h-[21.75px]' src={prime_twitter} alt="prime_twitter" />
                </button>
                <button className='bg-transparent border-none cursor-pointer transition-transform hover:scale-110 focus:outline-none' onClick={() => console.log('Mail clicked')} aria-label="Email">
                  <img className='w-5 h-5 md:w-6 md:h-[21.75px]' src={ic_mail} alt="ic_mail" />
                </button>
                <button className='bg-transparent border-none cursor-pointer transition-transform hover:scale-110 focus:outline-none' onClick={() => console.log('Phone clicked')} aria-label="Phone">
                  <img className='w-5 h-5 md:w-6 md:h-[21.75px]' src={ic_phone} alt="ic_phone" />
                </button>
                <button className='bg-transparent border-none cursor-pointer transition-transform hover:scale-110 focus:outline-none' onClick={() => console.log('Instagram clicked')} aria-label="Instagram">
                  <img className='w-5 h-5 md:w-6 md:h-[21.75px]' src={icons_insta} alt="icons_insta" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
