import { Button, cx, Drawer, useTheme } from "@refraktor/core";
import { useState } from "react";

function App() {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-dark-900 h-screen text-white flex flex-col items-center justify-center gap-4">
            <div
                className={cx(
                    "rounded-lg p-4 w-full max-w-md flex flex-col gap-2",
                    theme === "dark" ? "bg-dark-800" : "bg-light-400"
                )}
            >
                <Button onClick={toggleTheme}>Toggle Theme</Button>
                <Button onClick={() => setIsOpen(!isOpen)}>
                    Toggle Drawer
                </Button>

                <Drawer opened={isOpen} onOpenedChange={setIsOpen}>
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header>WTF</Drawer.Header>
                        <p>Drawer content</p>
                    </Drawer.Content>
                </Drawer>
            </div>
        </div>
    );
}

export default App;
