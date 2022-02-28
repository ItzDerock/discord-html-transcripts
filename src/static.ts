export const defaultPFP = 'https://cdn.discordapp.com/embed/avatars/0.png';

export const DummyUser = {
    bot: false,
    id: '00000000000',
    tag: "Unknown User#0000",
    name: "Unknown User",
    username: "Unknown User",
    hexAccentColor: "#FFFFFF",
    avatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png'
}

export const LanguageAliases = {
    'ts': 'typescript',
    'js': 'javascript',
    'py': 'python',
    'rb': 'ruby',
}

export default {
    defaultPFP,
    DummyUser,
    LanguageAliases
}