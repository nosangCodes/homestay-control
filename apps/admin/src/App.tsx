import "./App.css";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";

function App() {
  return (
    <>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <button className="ui-text-rose-800 ui-text-4xl ui-font-semibold">
        Hello world
      </button>
    </>
  );
}

export default App;
