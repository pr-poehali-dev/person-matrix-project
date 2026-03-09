export type Step =
  | "problem"
  | "situation"
  | "emotion1"
  | "chain_trigger"
  | "chain_emotion"
  | "root"
  | "show_chain"
  | "warmth_check"
  | "positive_state"
  | "positive_action"
  | "positive_feeling"
  | "review"
  | "final";

export type ChainItem = {
  trigger: string;
  emotion: string;
};
