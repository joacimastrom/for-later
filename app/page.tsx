import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SmileIcon } from "lucide-react";

export default function Home() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>Nextjs boilerplate</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Good luck on the new project <SmileIcon />
        </p>
      </CardContent>
      <CardFooter>
        <p>Setup the env variables</p>
      </CardFooter>
    </Card>
  );
}
