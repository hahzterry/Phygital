"use client"
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const DEVELOPER = {
  name: "Wizard of Hahz",
  github: "https://github.com/trigno1",
  linkedin: "https://www.linkedin.com/in/hahzterry/",
  email: "hahz5d@pm.me",
  socialPin: "https://social.3wordpin.com/pin/u/hahz/", // Added social pin URL
};

interface FooterProps {
  dark?: boolean;
}

export function Footer({ dark = false }: FooterProps) {
  const { t } = useLanguage();
  const bg = dark ? "bg-[#050510] border-t border-white/5" : "bg-stone-50 border-t border-stone-200";
  const textTitle = dark ? "text-white" : "text-stone-900";
  const textSub = dark ? "text-white/50" : "text-stone-500";
  const hover = dark ? "hover:text-white" : "hover:text-stone-900";
  const iconBg = dark ? "bg-white/5 border border-white/10" : "bg-white border border-stone-200 shadow-sm";

  return (
    <footer className={`w-full relative overflow-hidden py-10 md:py-14 ${bg}`}>
      {/* Ambient top border glow for dark mode */}
      {dark && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />}

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 w-full">
        
        {/* Brand section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/phygital_ultra_logo.png" alt="Phygital Logo" width={32} height={32} className="object-contain" />
            <span className={`text-xl font-black tracking-tight ${textTitle}`}>{t("foot.brandName") || "Phygital"}</span>
          </div>
          <p className={`text-sm font-medium ${textSub}`}>{t("foot.desc")}</p>
        </div>

        {/* Developer Credit */}
        <div className="group flex flex-col items-center px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all duration-500">
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${textSub}`}>
            developed and maintained by
          </span>
          <span className={`text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 group-hover:scale-105 transition-transform duration-500`}>
            {DEVELOPER.name}
          </span>
        </div>

        {/* Social interactions */}
        <div className="flex items-center gap-4">
          {[
            { icon: Github, href: DEVELOPER.github, title: "GitHub", color: "hover:bg-white/10 hover:text-white" },
            { icon: Linkedin, href: DEVELOPER.linkedin, title: "LinkedIn", color: "hover:bg-blue-600/20 hover:text-blue-400" },
            { icon: Mail, href: `mailto:${DEVELOPER.email}`, title: "Email", color: "hover:bg-indigo-600/20 hover:text-indigo-400" },
            { icon: () => <span className="text-lg">💬</span>, href: DEVELOPER.socialPin, title: "Social Pin", color: "hover:bg-emerald-600/20 hover:text-emerald-400" }
          ].map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" title={item.title}
              className={`p-3 rounded-xl ${iconBg} ${textSub} transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
