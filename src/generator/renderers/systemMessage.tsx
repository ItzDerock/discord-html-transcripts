import { DiscordReaction, DiscordReactions, DiscordSystemMessage } from '@derockdev/discord-components-react';
import { MessageType, type GuildMember, type Message, type User } from 'discord.js';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils';
import { RenderMessageContext } from '..';


const AvailableLanguages = [
  "ENGLISH", "BRAZILIAN"
]

export default async function renderSystemMessage(message: Message, context: RenderMessageContext) {
  
    let dscmsg1 = ""
    let dscmsg2 = ""
    let dscmsg3 = ""
    let dscmsg4 = ""
    let dscmsg5 = ""
  
    if(AvailableLanguages.includes(context?.Language?.toUpperCase() || "ENGLISH") && context?.Language?.toUpperCase() == "ENGLISH"){
      dscmsg1 = "pinned"
      dscmsg2 = "a message"
      dscmsg3 = "to this channel."
      dscmsg4 = "boosted the server!"
      dscmsg5 = "started a thread:"
      
    } else if(AvailableLanguages.includes(context?.Language?.toUpperCase() || "ENGLISH") && context?.Language?.toUpperCase() == "BRAZILIAN") {
      dscmsg1 = "fixado"
      dscmsg2 = "uma mensagem"
      dscmsg3 = "para este canal"
      dscmsg4 = "impulsionou o servidor!"
      dscmsg5 = "iniciou um tópico:"
    }

  switch (message.type) {
    case MessageType.RecipientAdd:
    case MessageType.UserJoin:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="join">
          {JoinMessage(message.member, message.author, context)}
        </DiscordSystemMessage>
      );

    case MessageType.ChannelPinnedMessage:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="pin">
          <Highlight color={message.member?.roles.color?.hexColor}>{message.author.username}</Highlight> {dscmsg1}{' '}
          <i data-goto={message.reference?.messageId}>{dscmsg2}</i> {dscmsg3}
          {/* reactions */}
          {message.reactions.cache.size > 0 && (
            <DiscordReactions slot="reactions">
              {message.reactions.cache.map((reaction, id) => (
                <DiscordReaction
                  key={`${message.id}r${id}`}
                  name={reaction.emoji.name!}
                  emoji={parseDiscordEmoji(reaction.emoji)}
                  count={reaction.count}
                />
              ))}
            </DiscordReactions>
          )}
        </DiscordSystemMessage>
      );

    case MessageType.GuildBoost:
    case MessageType.GuildBoostTier1:
    case MessageType.GuildBoostTier2:
    case MessageType.GuildBoostTier3:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="boost">
          <Highlight color={message.member?.roles.color?.hexColor}>{message.author.username}</Highlight> {dscmsg4}
        </DiscordSystemMessage>
      );

    case MessageType.ThreadStarterMessage:
      return (
        <DiscordSystemMessage id={`ms-${message.id}`} key={message.id} type="thread">
          <Highlight color={message.member?.roles.color?.hexColor}>{message.author.username}</Highlight> {dscmsg5} <i data-goto={message.reference?.messageId}>{message.content}</i>
        </DiscordSystemMessage>
      );

    default:
      return undefined;
  }
}

export function Highlight({ children, color }: { children: React.ReactNode; color?: string }) {
  return <i style={{ color: color ?? 'white' }}>{children}</i>;
}



export function JoinMessage(member: GuildMember | null, fallbackUser: User, context: RenderMessageContext) {
  if(AvailableLanguages.includes(context?.Language?.toUpperCase() || "ENGLISH") && context?.Language?.toUpperCase() == "ENGLISH"){
    let allJoinMessages = [
      '{user} just joined the server - glhf!',
      '{user} just joined. Everyone, look busy!',
      '{user} just joined. Can I get a heal?',
      '{user} joined your party.',
      '{user} joined. You must construct additional pylons.',
      'Ermagherd. {user} is here.',
      'Welcome, {user}. Stay awhile and listen.',
      'Welcome, {user}. We were expecting you ( ͡° ͜ʖ ͡°)',
      'Welcome, {user}. We hope you brought pizza.',
      'Welcome {user}. Leave your weapons by the door.',
      'A wild {user} appeared.',
      'Swoooosh. {user} just landed.',
      'Brace yourselves {user} just joined the server.',
      '{user} just joined. Hide your bananas.',
      '{user} just arrived. Seems OP - please nerf.',
      '{user} just slid into the server.',
      'A {user} has spawned in the server.',
      'Big {user} showed up!',
      "Where's {user}? In the server!",
      '{user} hopped into the server. Kangaroo!!',
      '{user} just showed up. Hold my beer.',
      'Challenger approaching - {user} has appeared!',
      "It's a bird! It's a plane! Nevermind, it's just {user}.",
      "It's {user}! Praise the sun! \\\\[T]/",
      'Never gonna give {user} up. Never gonna let {user} down.',
      'Ha! {user} has joined! You activated my trap card!',
      'Cheers, love! {user} is here!',
      'Hey! Listen! {user} has joined!',
      "We've been expecting you {user}",
      "It's dangerous to go alone, take {user}!",
      "{user} has joined the server! It's super effective!",
      'Cheers, love! {user} is here!',
      '{user} is here, as the prophecy foretold.',
      "{user} has arrived. Party's over.",
      'Ready player {user}',
      '{user} is here to kick butt and chew bubblegum. And {user} is all out of gum.',
      "Hello. Is it {user} you're looking for?",
    ];

    const randomMessage = allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)];

    return randomMessage
      .split('{user}')
      .flatMap((item, i) => [
        item,
        <Highlight color={member?.roles.color?.hexColor} key={i}>
          {member?.nickname ?? fallbackUser.username}
        </Highlight>,
      ])
      .slice(0, -1);
  } else if(AvailableLanguages.includes(context?.Language?.toUpperCase() || "ENGLISH") && context?.Language?.toUpperCase() == "BRAZILIAN") {
    const allJoinMessages = [
      '{user} acabou de entrar no servidor - glhf!',
      '{user} acabou de entrar. Todos, pareçam ocupados!',
      '{user} acabou de entrar. Posso receber uma cura?',
      '{user} entrou no seu grupo.',
      '{user} entrou. Você deve construir pilões adicionais.',
      'Ermagherd. {user} está aqui.',
      'Bem-vindo, {user}. Fique um tempo e ouça.',
      'Bem-vindo, {user}. Estávamos esperando por você ( ͡° ͜ʖ ͡°)',
      'Bem-vindo, {user}. Esperamos que você tenha trazido pizza.',
      'Bem-vindo {user}. Deixe suas armas na porta.',
      'Um {user} selvagem apareceu.',
      'Swoooosh. {user} acabou de pousar.',
      'Preparem-se {user} acabou de entrar no servidor.',
      '{user} acabou de entrar. Escondam suas bananas.',
      '{user} acabou de chegar. Parece OP - por favor, faça um nerf.',
      '{user} acabou de escorregar para o servidor.',
      'Um {user} nasceu no servidor.',
      '{user} grande apareceu!',
      "Onde está {user}? No servidor!",
      '{user} saltou para o servidor. Canguru!!',
      '{user} acabou de aparecer. Segurem minha cerveja.',
      'Desafiante se aproximando - {user} apareceu!',
      "É um pássaro! É um avião! Não se preocupe, é apenas {user}.",
      "É {user}! Louvado seja o sol! \\\\[T]/",
      'Nunca vou desistir de {user}. Nunca vou abandonar {user}.',
      'Ha! {user} entrou! Você ativou minha carta armadilha!',
      'Saúde, amor! {user} está aqui!',
      'Ei! Escutem! {user} entrou!',
      "Estávamos esperando por você {user}",
      "É perigoso ir sozinho, leve {user}!",
      "{user} entrou no servidor! É super eficaz!",
      'Saúde, amor! {user} está aqui!',
      '{user} está aqui, como a profecia previu.',
      "{user} chegou. A festa acabou.",
      'Jogador pronto {user}',
      '{user} está aqui para chutar traseiros e mastigar chiclete. E {user} está sem chiclete.',
      "Olá. É {user} que você está procurando?",
    ];
    
    const randomMessage = allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)];

    return randomMessage
      .split('{user}')
      .flatMap((item, i) => [
        item,
        <Highlight color={member?.roles.color?.hexColor} key={i}>
          {member?.nickname ?? fallbackUser.username}
        </Highlight>,
      ])
      .slice(0, -1);
  }
  

 
}
