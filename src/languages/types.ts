/**
 * Common language type
 */
export type Language = {
  reply: {
    command: string;
    attachment: string;
  };

  system: {
    joinMessages: string[];
    messagePinned: string;
  };

  // /**
  //  * Server boosts
  //  */
  // boosts
};
