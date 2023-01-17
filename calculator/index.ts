export type Reactions =
  | "BURGEON"
  | "HYPERBLOOM"
  | "OVERLOADED"
  | "BLOOM"
  | "SHATTERED"
  | "ELECTRO-CHARGED"
  | "SWIRL"
  | "SUPERCONDUCT"
  | "BURNING"
  | "VAPE"
  | "REV-VAPE"
  | "MELT"
  | "REV-MELT";

export type DamageTypes =
  | "dendro"
  | "geo"
  | "anemo"
  | "cryo"
  | "electro"
  | "hydro"
  | "pyro"
  | "physical";

export interface Props {
  MotionValue?: {
    ATK?: number;
    DEF?: number;
    HP?: number;
    EM?: number;
  };
  StatValue?: {
    ATK?: number;
    DEF?: number;
    HP?: number;
    EM?: number;
  };
  SpecialMultiplier?: {
    isEvilSoother: boolean;
    Talent: number;
  };
  FlatDamage?: number;
  DamageType: DamageTypes;
  DamageBonus?: {
    [key in DamageTypes]: number;
  };
  DamageReduction?: number;
  CritRate?: number;
  CritDamage?: number;
  CharacterLevel?: number;
  EnemyLevel?: number;
  DefReduction?: number;
  DefIgnore?: number;
  // Resistance in percentage
  Resistance?: {
    [key in DamageTypes]: number;
  };

  AmplifyingReaction?: "VAPE" | "REV-VAPE" | "MELT" | "REV-MELT";
  AmplifyingReactionBonus?: number;
  TransformativeReaction?:
    | "BURGEON"
    | "HYPERBLOOM"
    | "OVERLOADED"
    | "BLOOM"
    | "SHATTERED"
    | "ELECTRO-CHARGED"
    | "SWIRL"
    | "SUPERCONDUCT"
    | "BURNING";
  TransformativeReactionBonus?: number;
  ECTriggers?: number;
  SwirledElement?: "cryo" | "elctro" | "hydro" | "pyro";
  AdditiveReaction?: "SPREAD" | "AGGRAVATE";
  AdditiveReactionBonus?: number;
  Proc?: {
    MotionValue: {
      ATK?: number;
      DEF?: number;
      HP?: number;
      EM?: number;
    };
    CritRate?: number;
    CritDamage?: number;
    DamageType: DamageTypes;
    AmplifyingReaction?: "VAPE" | "REV-VAPE" | "MELT" | "REV-MELT";
    AmplifyingReactionBonus?: number;
    TransformativeReaction?:
      | "BURGEON"
      | "HYPERBLOOM"
      | "OVERLOADED"
      | "BLOOM"
      | "SHATTERED"
      | "ELECTRO-CHARGED"
      | "SWIRL"
      | "SUPERCONDUCT"
      | "BURNING";
    TransformativeReactionBonus?: number;
    ECTriggers?: number;
    AdditiveReaction?: "SPREAD" | "AGGRAVATE";
    AdditiveReactionBonus?: number;
  }[];
}

const levelMultiplier = [
  17.165605545043945, 17.165605545043945, 18.53504753112793, 19.90485382080078,
  21.27490234375, 22.6454, 24.649612426757812, 26.640642166137695,
  28.868587493896484, 31.36768, 34.14334487915039, 37.201, 40.66,
  44.4466667175293, 48.56352, 53.74848, 59.0818977355957, 64.4200439453125,
  69.72446, 75.12314, 80.58478, 86.11203, 91.70374, 97.24463, 102.8126449584961,
  108.40956, 113.20169, 118.1029052734375, 122.97932, 129.72732543945312,
  136.29291, 142.6708526611328, 149.02902, 155.41699, 161.8255, 169.10631,
  176.51808, 184.07274, 191.70952, 199.55691528320312, 207.38205, 215.3989,
  224.16566467285156, 233.50216674804688, 243.35057, 256.0630798339844,
  268.5435, 281.52606201171875, 295.0136413574219, 309.0672, 323.6016,
  336.7575378417969, 350.5303, 364.4827, 378.6191711425781, 398.6004,
  416.39825439453125, 434.387, 452.9510498046875, 472.6062316894531, 492.8849,
  513.5685424804688, 539.1032, 565.5105590820312, 592.5387573242188, 624.4434,
  651.4701538085938, 679.4968, 707.7940673828125, 736.6714477539062,
  765.6402587890625, 794.7734, 824.6773681640625, 851.1578, 877.7420654296875,
  914.2291, 946.7467651367188, 979.4114, 1011.223, 1044.791748046875, 1077.4437,
  1109.99755859375, 1142.9766, 1176.3695, 1210.1844482421875, 1253.8357,
  1288.9527587890625, 1325.4841, 1363.4569, 1405.0974, 1446.8535, 1488.2156,
  1528.4446, 1580.3679, 1630.8475, 1711.19775390625, 1780.454, 1847.32275390625,
  1911.4744, 1972.8644, 2030.0718, 2084.6357421875, 2139.05029296875,
  2193.21337890625, 2234.17333984375, 2284.82421875, 2303.821533203125, 2322.88,
  2341.99951171875, 2361.1806640625, 2380.42333984375, 2399.727783203125,
  2419.09423828125, 2438.5224609375, 2458.01318359375, 2491.481,
  2515.023681640625, 2538.6435546875, 2562.340576171875, 2586.115,
  2609.96728515625, 2633.897216796875, 2657.905, 2681.9912109375,
  2706.15576171875, 2730.399, 2740.8056640625, 2751.238, 2761.696, 2772.1796875,
  2782.689, 2793.223876953125, 2803.78466796875, 2814.371337890625, 2824.984,
  2835.622314453125, 2846.28662109375, 2856.977294921875, 2867.69384765625,
  2878.436767578125, 2889.20556640625, 2900.001, 2910.822509765625,
  2921.67041015625, 2932.545, 2943.44580078125, 2954.373291015625,
  2965.3271484375, 2976.307861328125, 2987.315185546875, 2998.349365234375,
  3009.41015625, 3020.498, 3031.61279296875, 3042.75439453125, 3053.923,
  3065.119, 3076.341796875, 3087.591796875, 3098.869140625, 3110.173828125,
  3121.505615234375, 3132.865, 3144.252, 3155.666259765625, 3167.108,
  3178.577392578125, 3190.07470703125, 3201.599609375, 3213.152,
  3224.732666015625, 3236.341, 3247.977294921875, 3259.6416015625, 3271.334,
  3283.054443359375, 3294.803, 3306.579833984375, 3318.384765625, 3330.218,
  3342.079833984375, 3353.97, 3365.888671875, 3377.835693359375,
  3389.8115234375, 3401.816, 3413.848876953125, 3425.911, 3438.00146484375,
  3450.120849609375, 3462.269287109375, 3474.446533203125, 3486.65283203125,
  3498.888427734375, 3511.15283203125, 3523.446533203125, 3535.623, 3547.975,
  3560.356201171875, 3572.766845703125, 3585.207,
];

export const calculate = (props: Props) => {
  const CritMultiplier = (cr: number, cd: number) => {
    return 1 + Math.min(Math.max(cr, 0), 100) * cd;
  };
  const DamageBonusMultiplier = (dmgBonus: number, dmgReduction: number) => {
    return 1 + Math.max(dmgBonus, 0) - Math.max(dmgReduction, 0);
  };
  const DefMultiplier = (
    charLevel: number,
    enemyLevel: number,
    defReduction: number,
    defIgnore: number
  ) => {
    const numerator = charLevel + 100;
    const denominator =
      charLevel +
      100 +
      (enemyLevel + 100) * (1 - Math.min(defReduction, 90)) * (1 - defIgnore);
    return numerator / denominator;
  };
  const EnemyResistanceMultiplier = (resistance: number) => {
    switch (true) {
      case resistance / 100 < 0:
        return 1 - resistance / 100 / 2;
      case resistance / 100 < 0.75:
        return 1 - resistance / 100;
      case resistance / 100 >= 0.75:
        return 1 / (4 * (resistance / 100) + 1);
      default:
        return 0.9;
    }
  };
  const SpecialMultipler = (specialMultiplier?: {
    isEvilSoother: boolean;
    Talent: number;
  }) => {
    if (specialMultiplier?.isEvilSoother) {
      return 1.5;
    }
    if (specialMultiplier?.Talent) {
      return specialMultiplier.Talent / 100;
    } else return 1;
  };

  const AmplifiyingReactionMultiplier = (
    reactionType: "VAPE" | "REV-VAPE" | "MELT" | "REV-MELT" | undefined,
    em: number,
    reactionBonus: number
  ) => {
    let reactionMultiplier = 1;
    switch (reactionType) {
      case "MELT":
      case "VAPE":
        reactionMultiplier = 2;
        break;
      case "REV-MELT":
      case "REV-VAPE":
        reactionMultiplier = 1.5;
        break;
      default:
        return 1;
    }
    return (
      reactionMultiplier * (1 + (2.78 * em) / (1400 + em) + reactionBonus / 100)
    );
  };

  const TransformativeReactionMultiplier = (
    reactionType:
      | "BURGEON"
      | "HYPERBLOOM"
      | "OVERLOADED"
      | "BLOOM"
      | "SHATTERED"
      | "ELECTRO-CHARGED"
      | "SWIRL"
      | "SUPERCONDUCT"
      | "BURNING"
      | undefined,
    levelMultiplier: number,
    enemyResistanceMultiplier: number,
    em: number,
    ecTriggers: number,
    reactionBonus: number
  ) => {
    let reactionMultiplier = 0;
    switch (reactionType) {
      case "HYPERBLOOM":
      case "BURGEON":
        reactionMultiplier = 3;
        break;
      case "OVERLOADED":
      case "BLOOM":
        reactionMultiplier = 2;
        break;

      case "SHATTERED":
        reactionMultiplier = 1.5;
        break;

      case "ELECTRO-CHARGED":
        reactionMultiplier = 1.2 * ecTriggers;
        break;

      case "SWIRL":
        reactionMultiplier = 0.6;
        break;

      case "SUPERCONDUCT":
        reactionMultiplier = 0.5;
        break;

      case "BURNING":
        reactionMultiplier = 0.25;
        break;
      default:
        return 0;
    }
    return (
      reactionMultiplier *
      levelMultiplier *
      (1 + (16 * em) / (2000 + em) + reactionBonus / 100) *
      enemyResistanceMultiplier
    );
  };

  const AdditiveDamage = (
    reactionType: "SPREAD" | "AGGRAVATE" | undefined,
    levelMultiplier: number,
    em: number,
    reactionBonus: number
  ) => {
    let reactionMultiplier = 0;
    switch (reactionType) {
      case "SPREAD":
        reactionMultiplier = 1.25;
        break;
      case "AGGRAVATE":
        reactionMultiplier = 1.15;
        break;
      default:
        return 0;
    }
    return (
      reactionMultiplier *
      levelMultiplier *
      (1 + (5 * em) / (1200 + em) + reactionBonus)
    );
  };

  const Proc = (props: Props) => {
    if (props.Proc) {
      return props.Proc.map((proc) => {
        return calculate({
          MotionValue: proc.MotionValue,
          StatValue: props.StatValue,
          CritRate: proc.CritRate,
          CritDamage: proc.CritDamage,
          DamageType: proc.DamageType,
          DamageBonus: props.DamageBonus,
          Resistance: props.Resistance,
          AmplifyingReaction: proc.AmplifyingReaction,
          AmplifyingReactionBonus: proc.AmplifyingReactionBonus,
          TransformativeReaction: proc.TransformativeReaction,
          TransformativeReactionBonus: proc.TransformativeReactionBonus,
          AdditiveReaction: proc.AdditiveReaction,
          AdditiveReactionBonus: proc.AdditiveReactionBonus,
        });
      }).reduce((partialSum, a) => partialSum + a, 0);
    } else return 0;
  };
  const output =
    ((((props.MotionValue?.ATK ?? 0) / 100) * (props.StatValue?.ATK ?? 0) +
      ((props.MotionValue?.DEF ?? 0) / 100) * (props.StatValue?.DEF ?? 0) +
      ((props.MotionValue?.HP ?? 0) / 100) * (props.StatValue?.HP ?? 0) +
      ((props.MotionValue?.EM ?? 0) / 100) * (props.StatValue?.EM ?? 0)) *
      SpecialMultipler(props.SpecialMultiplier) +
      (props.FlatDamage ?? 0) +
      AdditiveDamage(
        props.AdditiveReaction,
        levelMultiplier[props.CharacterLevel ?? 90],
        props.StatValue?.EM ?? 0,
        props.AdditiveReactionBonus ?? 0
      )) *
      CritMultiplier(props.CritRate ?? 0, props.CritDamage ?? 0) *
      DamageBonusMultiplier(
        props.DamageBonus?.[props.DamageType] ?? 0,
        props.DamageReduction ?? 0
      ) *
      DefMultiplier(
        props.CharacterLevel ?? 90,
        props.EnemyLevel ?? 80,
        props.DefReduction ?? 0,
        props.DefIgnore ?? 0
      ) *
      EnemyResistanceMultiplier(props.Resistance?.[props.DamageType] ?? 10) *
      AmplifiyingReactionMultiplier(
        props.AmplifyingReaction,
        props.StatValue?.EM ?? 0,
        props.AmplifyingReactionBonus ?? 0
      ) +
    TransformativeReactionMultiplier(
      props.TransformativeReaction,
      levelMultiplier[props.CharacterLevel ?? 90],
      EnemyResistanceMultiplier(props.Resistance?.[props.DamageType] ?? 10),
      props.StatValue?.EM ?? 0,
      props.ECTriggers ?? 1,
      props.TransformativeReactionBonus ?? 0
    );

  return output;
};
