import e from"@actions/core";import o from"@actions/github";async function r(){try{let t=e.getInput("channel-id",{required:!0}),i=e.getInput("bot-token",{required:!0}),s=e.getInput("title",{required:!0}),c=e.getInput("extends-section-fields",{required:!1}),n=o.context;console.log("aaa",n)}catch(t){t instanceof Error?e.setFailed(t.message):e.setFailed("Unknown error")}}var u=r;export{u as default};