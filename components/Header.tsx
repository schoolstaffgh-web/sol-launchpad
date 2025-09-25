"use client";
import Image from "next/image";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Home, FileText, Droplets, Layers } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Header = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-10 flex justify-between items-center w-full gap-8 px-4 py-2 bg-background font-monsterr">
      {/* Responsive Logo - Clickable to Home */}
      <Link href="/" passHref>
        <Image
          src="/Logo.webp"   // ✅ updated to WebP
          alt="Navitender Logo"
          width={120}
          height={40}
          priority          // ✅ loads faster on first render
          className="cursor-pointer w-24 h-auto sm:w-32 lg:w-40"
        />
      </Link>

      <div className="flex items-center justify-between lg:w-full">
        {/* Desktop Navigation */}
        <nav className="hidden gap-4 lg:flex">
          <Link
            href="/"
            className="duration-300 hover:text-tealClr"
          >
            Home
          </Link>
          <Link
            href="/token-creator"
            className="duration-300 hover:text-tealClr"
          >
            Token Creator
          </Link>
          <Link
            href="https://raydium.io/liquidity/create-pool/"
            target="_blank"
            rel="noopener noreferrer"
            className="duration-300 hover:text-tealClr"
          >
            Liquidity Pool
          </Link>
          <Link
            href="https://raydium.io/swap/?inputMint=sol&outputMint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
            target="_blank"
            rel="noopener noreferrer"
            className="duration-300 hover:text-tealClr"
          >
            Manage Liquidity
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-4">
          <WalletMultiButton />

          {/* Mobile Navigation (Sidebar) */}
          <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </SheetTrigger>

            <SheetContent className="w-[400px] sm:w-[540px]">
              <nav className="flex flex-col gap-4 text-[1.5em] mt-8">
                <Link
                  onClick={() => setShowSidebar(false)}
                  className="SidebarLink"
                  href="/"
                >
                  <Home size={28} />
                  <div className="text-[0.8em]">Home</div>
                </Link>
                <Link
                  onClick={() => setShowSidebar(false)}
                  className="SidebarLink"
                  href="/token-creator"
                >
                  <FileText size={28} />
                  <div className="text-[0.8em]">Token Creator</div>
                </Link>
                <Link
                  onClick={() => setShowSidebar(false)}
                  className="SidebarLink"
                  href="https://raydium.io/liquidity/create-pool/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Droplets size={28} />
                  <div className="text-[0.8em]">Liquidity Pool</div>
                </Link>
                <Link
                  onClick={() => setShowSidebar(false)}
                  className="SidebarLink"
                  href="https://raydium.io/swap/?inputMint=sol&outputMint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Layers size={28} />
                  <div className="text-[0.8em]">Manage Liquidity</div>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
