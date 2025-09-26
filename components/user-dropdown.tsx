"use client";

import {LogOutIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import NavItems from "@/components/nav-items";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const user = {
  name: "Han Solo",
  email: "han.solo@starwars.com",
};

export default function UserDropdown() {
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 text-gray-400 hover:text-yellow-500"
        >
          <Avatar className="size-8">
            <AvatarImage src="/assets/icons/star.svg" />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start text-base font-medium text-gray-400">
            {user.name}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400 bg-gray-800">
        <DropdownMenuLabel>
          <div className="flex relative items-center gap-3 py-2">
            <Avatar className="size-10">
              <AvatarImage src="/assets/icons/star.svg" />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start">
              <span className="text-base font-medium text-gray-400">
                {user.name}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="sm:hidden bg-gray-600" />
        <nav className="sm:hidden">
          <NavItems />
        </nav>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer"
        >
          <LogOutIcon className="size-4 hidden sm:block" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
