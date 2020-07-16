var data:any = [
    {
        tags: ["button", "onclick", "callback", "click"],
        hypothesis: "The <code>onClick</code> attribute is defined incorrectly for your button. Try using <code>onClick={() => function()}</code>",
        verification: 0
    },
    {
        tags: ["button", "onclick", "callback", "click"],
        hypothesis: "Your button callback function does not exist. Make sure that it does in your code.",
        verification: 1
    },
    {
        tags: ["button"],
        hypothesis: "Your button is defined incorrectly in JSX. Make sure you have a closing tag, and check other syntax issues.",
        verification: 2
    },
    {
        tags: ["input", "changing", "change", "type", "same"],
        hypothesis: "You do not have an <code>onChange</code> attribute defined for your input. Once you make one, make sure that it updates the input's value.",
        verification: 3
    },
    {
        tags: ["input", "error", "type"],
        hypothesis: "The <code>onChange</code> attribute is defined incorrectly for your input. For example, use this syntax: <code>onChange={(e) => setInputValue(e.target.value)}</code>",
        verification: 4
    },
    {
        tags: ["state", "update", "immediately", "setstate", "updating", "changing"],
        hypothesis: "React does not manage state synchronously. If you are checking state directly after a calling <code>setState</code>, the state will not appear to have changed.",
        verification: 5
    }
]

export { data };