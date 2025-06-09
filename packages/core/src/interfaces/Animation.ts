import gsap from "gsap";

export interface IVariant extends gsap.TweenVars {
    /**
     * 变体名称
     */
    name: string;

    opacity?: number;
    scale?: number;
    color?: number;
    iconUrl?: string;
}
