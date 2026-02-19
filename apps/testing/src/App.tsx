import { Button, cx, useTheme } from "@refraktor/core";

function App() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="bg-dark-900 h-screen text-white flex flex-col items-center justify-center gap-4">
            <div
                className={cx(
                    "rounded-lg p-4 w-full max-w-md flex flex-col gap-2",
                    theme === "dark" ? "bg-dark-800" : "bg-light-400"
                )}
            >
                <Button onClick={toggleTheme}>Toggle Theme</Button>
            </div>
        </div>
    );
}

export default App;
