import "../../styles/tiptap.css";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Link from "@tiptap/extension-link";
import ReactConfetti from "react-confetti";
import IconBold from "./react-icons/IconBold";
import IconH1 from "./react-icons/IconH1";
import IconH2 from "./react-icons/IconH2";
import IconItalic from "./react-icons/IconItalic";
import IconSend from "./react-icons/IconSend";
import IconStrike from "./react-icons/IconStrike";
import IconMail from "./react-icons/IconMail";
import Loader from "./Loader";

// define your extension array

const content = "<p>Hello World!</p>";

const MenuBar = ({ emailRef, runConfetti, setSending }) => {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    function send() {
        const email = emailRef.current.value;
        if (!email.match(/[\w|\W]{4,}@[\w|\W]{4,}\.\w{2,}/)) {
            alert("Please enter a valid email address");
            return;
        }

        if (editor.getText() === "Hello World!") return;
        if (editor.getText() === "") return;

        let data = {
            message: "" + editor.getHTML() + "",
            email: email,
        };

        setSending(true);

        emailjs
            .send("service_sp2lrdb", "template_mcwlt1l", data, {
                publicKey: "_x7BiFEZyGo34c-er",
            })
            .then(
                () => {
                    runConfetti();
                    emailRef.current.value = "";
                    editor.commands.clearContent();
                },
                (error) => {
                    alert("FAILED...", error);
                }
            )
            .finally(() => setSending(false));
    }

    return (
        <div className="border-b-2 border-panel-border flex justify-between flex-wrap p-2 gap-2">
            <div className="button-group">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "is-active" : "duration-150 active:scale-90"}
                >
                    <IconBold className="h-7 w-7 text-text-dark" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "is-active" : "duration-150 active:scale-90"}
                >
                    <IconItalic className="h-7 w-7 text-text-dark" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? "is-active" : "duration-150 active:scale-90"}
                >
                    <IconStrike className="h-7 w-7 text-text-dark" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "is-active" : "duration-150 active:scale-90"}
                >
                    <IconH1 className="h-7 w-7 text-text-dark" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "is-active" : "duration-150 active:scale-90"}
                >
                    <IconH2 className="h-7 w-7 text-text-dark" />
                </button>
            </div>
            <div
                className=" w-fit flex cursor-pointer items-center gap-1 rounded-md text-background font-semibold p-2 bg-gradient-to-tl from-light to-accent-light"
                onClick={send}
            >
                <IconSend />
                <span>Send</span>
            </div>
        </div>
    );
};

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({}),
    Link.configure({
        autolink: false,
    }),
];

export default function ContactForm() {
    const emailRef = useRef(null);
    const [confetti, setConfetti] = useState(false);
    const [sending, setSending] = useState(false);

    function runConfetti() {
        setConfetti(true);
    }

    return (
        <div className="mt-5">
            <div className="your-email  flex items-center gap-2 rounded-md border-2 border-panel-border px-2 py-1">
                <IconMail className="h-9 w-9 text-dimmer" />
                <input
                    type="text"
                    ref={emailRef}
                    className="flex-1 outline-none text-light"
                    placeholder="Your email address"
                />
            </div>

            <div className="relative overflow-hidden rounded-md border-2 bg-panel-background  border-panel-border mt-2 ">
                {confetti && (
                    <ReactConfetti
                        onConfettiComplete={() => setConfetti(false)}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                    />
                )}

                {sending && (
                    <div className="absolute z-10 flex h-full w-full items-center justify-center bg-bg-footer/50">
                        <Loader className="loader h-12 w-12 text-accent-light" />
                    </div>
                )}
                <EditorProvider
                    slotBefore={<MenuBar emailRef={emailRef} runConfetti={runConfetti} setSending={setSending} />}
                    extensions={extensions}
                    content={content}
                ></EditorProvider>
            </div>
        </div>
    );
}
