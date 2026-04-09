import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const avatars = [
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    fallback: "OS",
    name: "Olivia Sparks",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    fallback: "HL",
    name: "Howard Lloyd",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    fallback: "HR",
    name: "Hallie Richards",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png",
    fallback: "JW",
    name: "Jenny Wilson",
  },
];

export const EventCard = () => {
  return (
    <Card className=" h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Sunrise Run Meetup!!
        </CardTitle>
        <CardDescription>Sat, Mar 30・ 8:00 AM</CardDescription>
      </CardHeader>
      <hr />
      <CardContent className="text-sm">
        <p className="overflow-y-auto max-h-[60px]">
          We are going to meet at the Budapest Riverside at 8:00 AM on Saturday,
          March 30. We will be running for 1 hour and then we will have a coffee
          break. Let&apos;s meet up and have a great time!
        </p>
        <ul className="mt-4 flex flex-col gap-2 ">
          <li>Location: Budapest Riverside</li>
          <li className="flex items-center gap-3">
            <p>24 joining</p>
            <div className="flex -space-x-2 hover:space-x-1">
              {avatars.map((avatar, index) => (
                <Avatar
                  key={index}
                  className="ring-background ring-2 transition-all duration-300 ease-in-out"
                >
                  <AvatarImage src={avatar.src} alt={avatar.name} />
                  <AvatarFallback className="text-xs">
                    {avatar.fallback}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Link href="#">
          <Button color="primary">View Event</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
