import { Operator, Side } from '@/models';

/** A rule of a strategy. */
type Rule = {
  /** The text of the rule. */
  text: string;

  /** The operator this rule applies to. */
  operator?: Operator;

  /** The side of play this rule applies to. */
  side?: Side;
};

/** The settings of the strategy. */
type Settings = {
  /** The side the strategy is played on. */
  side?: Side;

  /** The operators required to play in the strategy. */
  requiredOperators?: Operator[];

  /** The operators allowed to play in the strategy. */
  enabledOperators?: Operator[];

  /** The operators disallowed to play in the strategy. */
  disabledOperators?: Operator[];
};

export default class Strategy {
  /** The title of the strategy. */
  readonly title: string;

  /** The tagline of the strategy. */
  readonly tagline: string;

  /** The rules of the strategy. */
  readonly rules: Rule[];

  /** The settings of the strategy. */
  readonly settings: Settings;

  /**
   * Creates a new strategy.
   * 
   * @param title    The title of the strategy.
   * @param tagline  The tagline of the strategy.
   * @param rules    The rules of the strategy.
   * @param settings The settings of the strategy.
   */
  constructor(title: string, tagline: string, rules: Rule[], settings?: Settings) {
    this.title = title;
    this.tagline = tagline;
    this.rules = Array.from(rules);
    this.settings = settings;
  }
}
