import React from 'react';
import { CertificateAssets } from './CertificateAssets';

const CertificateTemplate = React.forwardRef(({ 
  certificate,
  course,
  learner
}, ref) => {
  // Map props to display values
  const studentName = learner?.fullName || learner?.userName || learner?.name || "Student Name";
  const courseTitle = course?.title || "Course Title";
  const issueDate = certificate?.issuedAt 
    ? new Date(certificate.issuedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
  const instructorName = course?.instructorName || course?.instructor?.fullName || course?.instructor?.name || "Director of Certification";
  const certificateId = certificate?.certificateId || "LH-CERT-PENDING";
  const description = course?.description;

  const fixDataUrl = (value) =>
    typeof value === 'string'
      ? value.replaceAll('circlecx', 'circle cx').replaceAll("Z'transform", "Z' transform")
      : value;
  
  return (
    <div ref={ref} className="relative flex items-center justify-center bg-zinc-200 p-4 min-h-[850px]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@400;500;600;700;900&family=Pinyon+Script&display=swap');
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-pinyon { font-family: 'Pinyon Script', cursive; }
          .text-shadow-emboss { text-shadow: 0px 1px 1px rgba(255,255,255,0.8), 0px -1px 0px rgba(0,0,0,0.1); }
          .engraved-pattern { filter: drop-shadow(0.5px 0.5px 0px rgba(255,255,255,0.7)) drop-shadow(-0.3px -0.3px 0px rgba(0,0,0,0.15)); }
        `}
      </style>
      
      <div className="relative mx-auto w-[968px] h-[780px]">
        {/* Shadows */}
        <div className="absolute inset-0 translate-y-4 rounded-sm bg-black/20 blur-2xl"></div>
        <div className="absolute inset-0 translate-y-1 rounded-sm bg-black/10 blur-md"></div>
        
        {/* Main Certificate */}
        <div className="relative h-full w-full overflow-hidden rounded-sm shadow-2xl" 
             style={{ background: 'linear-gradient(135deg, #f7f2e4 0%, #f0e9d8 25%, #ebe4d0 50%, #e8e0c8 75%, #e5dcc2 100%)' }}>
          
          {/* Base warm paper color */}
          <div className="pointer-events-none absolute inset-0 z-0" 
               style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(255,248,230,0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,245,220,0.4) 0%, transparent 50%)' }}></div>
          
          {/* Paper Fiber Noise Texture */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.08] mix-blend-multiply"
               style={{ backgroundImage: `url("${fixDataUrl(CertificateAssets.NOISE_SVG)}")` }}></div>
          
          {/* Fine Grain Overlay */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay"
               style={{ backgroundImage: `url("${fixDataUrl(CertificateAssets.GRAIN_SVG)}")` }}></div>
          
          {/* Subtle golden/sepia tint overlay */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" 
               style={{ background: 'linear-gradient(to bottom, rgba(180,140,80,0.3), rgba(160,120,60,0.2))' }}></div>
          
          {/* Paper Edge Darkening */}
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_40%,rgba(120,100,60,0.08)_100%)]"></div>
          
          {/* Subtle uneven coloring */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]" 
               style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(200,170,100,0.5) 0%, transparent 30%), radial-gradient(ellipse at 80% 70%, rgba(190,160,90,0.4) 0%, transparent 25%), radial-gradient(ellipse at 60% 20%, rgba(210,180,110,0.3) 0%, transparent 35%)' }}></div>
          
          {/* ============================================== */}
          {/* ENGRAVED IRREGULAR DOODLE PATTERNS */}
          {/* ============================================== */}
          
          {/* Layer 1: Shadow/Depth layer (dark, slightly offset) */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-multiply" 
               style={{ transform: 'translate(0.5px, 0.5px)', backgroundImage: `url("${fixDataUrl(CertificateAssets.DOODLE_LAYER_1)}")`, backgroundRepeat: 'repeat', backgroundSize: '380px 330px' }}></div>
          
          {/* Layer 2: Main engraved pattern */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.055] mix-blend-multiply engraved-pattern" 
               style={{ backgroundImage: `url("${fixDataUrl(CertificateAssets.DOODLE_LAYER_2)}")`, backgroundRepeat: 'repeat', backgroundSize: '380px 330px' }}></div>
          
          {/* Layer 3: Highlight layer (white, offset opposite direction for embossed effect) */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.12]" 
               style={{ transform: 'translate(-0.4px, -0.4px)', backgroundImage: `url("${fixDataUrl(CertificateAssets.DOODLE_LAYER_3)}")`, backgroundRepeat: 'repeat', backgroundSize: '380px 330px' }}></div>

          {/* ============================================== */}
          {/* ELEGANT ENGRAVED BORDER SYSTEM */}
          {/* ============================================== */}
          
          {/* 1. Outer Frame */}
          <div className="pointer-events-none absolute inset-[10px] z-10 border border-[#8b4513]/40 rounded-[2px]"></div>

          {/* 2. The Guilloche Pattern */}
          <div className="pointer-events-none absolute inset-[14px] z-10">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-[24px]" style={{ backgroundImage: `url('${CertificateAssets.GUILLOCHE_TOP}')` }}></div>
            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[24px]" style={{ backgroundImage: `url('${CertificateAssets.GUILLOCHE_BOTTOM}')` }}></div>
            {/* Left Bar */}
            <div className="absolute top-[24px] bottom-[24px] left-0 w-[24px]" style={{ backgroundImage: `url('${CertificateAssets.GUILLOCHE_LEFT}')` }}></div>
            {/* Right Bar */}
            <div className="absolute top-[24px] bottom-[24px] right-0 w-[24px]" style={{ backgroundImage: `url('${CertificateAssets.GUILLOCHE_RIGHT}')` }}></div>
          </div>

          {/* 3. Inner Triple-Line Engraving */}
          <div className="pointer-events-none absolute inset-[42px] z-10 border border-[#8b4513]/20 rounded-[1px]"></div>
          <div className="pointer-events-none absolute inset-[45px] z-10 border border-[#b8860b]/60 rounded-[1px]"></div>
          <div className="pointer-events-none absolute inset-[48px] z-10 border border-[#8b4513]/20 rounded-[1px]"></div>

          {/* 4. Corner Ornaments */}
          {/* Top Left */}
          <svg className="pointer-events-none absolute top-[14px] left-[14px] w-24 h-24 z-20 text-[#8b4513]" viewBox="0 0 100 100" fill="none">
             <path d="M12 12 L 35 12 M 12 12 L 12 35" stroke="currentColor" strokeWidth="1.5"/>
             <path d="M12 12 Q 40 12 45 35 Q 48 48 35 52 T 20 40" stroke="currentColor" strokeWidth="0.8" fill="none"/>
             <path d="M12 12 Q 12 40 35 45 Q 48 48 52 35 T 40 20" stroke="currentColor" strokeWidth="0.8" fill="none"/>
             <circle cx="12" cy="12" r="1.5" fill="#b8860b"/>
          </svg>
          {/* Top Right */}
          <svg className="pointer-events-none absolute top-[14px] right-[14px] w-24 h-24 z-20 text-[#8b4513] rotate-90" viewBox="0 0 100 100" fill="none">
             <path d="M12 12 L 35 12 M 12 12 L 12 35" stroke="currentColor" strokeWidth="1.5"/>
             <path d="M12 12 Q 40 12 45 35 Q 48 48 35 52 T 20 40" stroke="currentColor" strokeWidth="0.8" fill="none"/>
             <path d="M12 12 Q 12 40 35 45 Q 48 48 52 35 T 40 20" stroke="currentColor" strokeWidth="0.8" fill="none"/>
             <circle cx="12" cy="12" r="1.5" fill="#b8860b"/>
          </svg>
          {/* Bottom Left */}
          <svg className="pointer-events-none absolute bottom-[14px] left-[14px] w-24 h-24 z-20 text-[#8b4513] -rotate-90" viewBox="0 0 100 100" fill="none">
             <path d="M12 12 L 35 12 M 12 12 L 12 35" stroke="currentColor" strokeWidth="1.5"/>
             <path d="M12 12 Q 40 12 45 35 Q 48 48 35 52 T 20 40" stroke="currentColor" strokeWidth="0.8" fill="none"/>
             <path d="M12 12 Q 12 40 35 45 Q 48 48 52 35 T 40 20" stroke="currentColor" strokeWidth="0.8" fill="none"/>
             <circle cx="12" cy="12" r="1.5" fill="#b8860b"/>
          </svg>
          {/* Bottom Right */}
          <svg className="pointer-events-none absolute bottom-[14px] right-[14px] w-24 h-24 z-20 text-[#8b4513] rotate-180" viewBox="0 0 100 100" fill="none">
             <path d="M12 12 L 35 12 M 12 12 L 12 35" stroke="currentColor" strokeWidth="1.5"/>
             <path d="M12 12 Q 40 12 45 35 Q 48 48 35 52 T 20 40" stroke="currentColor" strokeWidth="0.8" fill="none"/>
             <path d="M12 12 Q 12 40 35 45 Q 48 48 52 35 T 40 20" stroke="currentColor" strokeWidth="0.8" fill="none"/>
             <circle cx="12" cy="12" r="1.5" fill="#b8860b"/>
          </svg>

          {/* ============================================== */}
          {/* CONTENT */}
          {/* ============================================== */}
          <div className="relative z-30 flex h-full flex-col px-28 py-24 pb-20">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5eed8] shadow-[inset_2px_4px_6px_rgba(120,100,60,0.15),inset_-2px_-4px_4px_rgba(255,255,255,0.8),2px_4px_8px_rgba(0,0,0,0.08)] text-amber-900 border-2 border-[#b8860b]/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#8b4513]" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
                </div>
                <div>
                  <p className="font-cinzel font-bold text-2xl text-[#5c3a11] tracking-wider text-shadow-emboss uppercase">LearnHub</p>
                  <p className="font-inter text-xs tracking-[0.2em] text-[#8b4513]/70 uppercase">Verified Certification</p>
                </div>
              </div>

              <div className="rotate-[-2deg] opacity-90 mix-blend-multiply flex flex-col items-center">
                <div className="rounded border-2 border-[#8b4513]/50 px-3 py-1 bg-[#8b4513]/5 text-[#8b4513] font-bold font-cinzel text-sm tracking-widest shadow-sm">
                  {certificateId}
                </div>
              </div>
            </div>

            <div className="mt-10 text-center flex-grow">
              <div className="inline-block relative mb-6">
                <span className="font-cinzel text-xl italic text-[#8b4513]/80 relative z-10 px-4">Certificate of Completion</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#b8860b] opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 12 100 5" fill="none" stroke="currentColor" strokeWidth="0.6"></path>
                </svg>
              </div>

              <p className="font-cinzel text-sm uppercase tracking-[0.3em] text-[#8b4513]/50 mb-4">This is to certify that</p>
              
              <h1 className="font-pinyon text-[5.5rem] leading-none text-[#3d2106] drop-shadow-[0_2px_1px_rgba(120,80,20,0.15)] py-3">
                {studentName}
              </h1>

              <div className="w-2/3 mx-auto h-px my-5 relative" style={{ background: 'linear-gradient(to right, transparent, #b8860b, transparent)' }}>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#b8860b] rotate-45 rounded-[1px]"></div>
              </div>

              <p className="font-cinzel text-lg text-[#5c3a11]/80 max-w-2xl mx-auto italic">
                has successfully mastered the requirements and passed all examinations for the professional course
              </p>

              <h2 className="mt-6 font-cinzel font-bold text-4xl text-[#3d2106] tracking-wide text-shadow-emboss">
                {courseTitle}
              </h2>
              {description && (
                <p className="mt-2 text-[#8b4513]/70 font-medium tracking-wide text-sm uppercase max-w-2xl mx-auto">
                    {description}
                </p>
              )}
            </div>

            <div className="relative mt-auto pt-8 grid grid-cols-12 gap-8 items-center" style={{ borderTop: '1px dashed #b8860b50' }}>
              
              <div className="col-span-4 text-center">
                 <div className="font-pinyon text-3xl text-[#5c3a11] mb-2 relative inline-block min-w-[120px]">
                    {issueDate}
                    <svg className="absolute -bottom-1 left-0 w-full h-4 text-[#8b4513] opacity-50 pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 5" fill="none" stroke="currentColor" strokeWidth="1.2"></path></svg>
                 </div>
                 <div className="h-px w-full mb-1" style={{ background: 'linear-gradient(to right, transparent, #b8860b80, transparent)' }}></div>
                 <p className="font-cinzel text-xs font-bold text-[#8b4513]/50 uppercase tracking-widest">Date Issued</p>
              </div>

              <div className="col-span-4 flex justify-center relative">
                 <div className="relative w-28 h-28 rounded-full shadow-[0_4px_10px_rgba(100,70,20,0.35),0_10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center bg-gradient-to-br from-[#f2d89b] via-[#bfa05f] to-[#8c6e30]">
                    <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.4)0%,transparent_50%,rgba(0,0,0,0.1)100%)]"></div>
                    <div className="absolute inset-2 rounded-full border border-[#7a5c22]/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] bg-[#d4af37]/10 backdrop-contrast-125"></div>
                    <div className="relative z-10 text-[#5c4014] flex flex-col items-center drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mb-1 opacity-90"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"></path></svg>
                       <span className="text-[0.6rem] font-bold tracking-wider uppercase">Official Seal</span>
                    </div>
                    <div className="absolute -bottom-4 z-0 w-16 h-16 bg-red-800 rotate-45 transform skew-x-12 shadow-md"></div>
                    <div className="absolute -bottom-4 z-0 w-16 h-16 bg-red-900 -rotate-45 transform -skew-x-12 shadow-md"></div>
                 </div>
              </div>

              <div className="col-span-4 text-center">
                 <div className="font-pinyon text-4xl text-[#3d2106] mb-2 relative inline-block min-w-[150px] -rotate-2">
                    {instructorName}
                    <div className="absolute -right-2 top-0 w-1 h-1 bg-[#8b4513] rounded-full opacity-40"></div>
                 </div>
                 <div className="h-px w-full mb-1" style={{ background: 'linear-gradient(to right, transparent, #b8860b80, transparent)' }}></div>
                 <p className="font-cinzel text-xs font-bold text-[#8b4513]/50 uppercase tracking-widest">Director of Certification</p>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
});

export default CertificateTemplate;
