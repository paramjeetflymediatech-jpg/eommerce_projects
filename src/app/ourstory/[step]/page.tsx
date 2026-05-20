import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import styles from "./step.module.css";

interface StepDetail {
  slug: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlights: string[];
  details: string;
  specs: { label: string; value: string }[];
}

const STEPS_DATA: Record<string, StepDetail> = {
  "yarn-knitting-ball": {
    slug: "yarn-knitting-ball",
    stepNumber: "01",
    title: "Yarn & Knitting Ball Selection",
    subtitle: "The foundation of all Aion Luxury garments",
    description: "Premium natural fibers form the core of Aion Luxury. We select extra-long staple organic cotton, fine merino wool, and grade-A Mongolian cashmere for their resilience, softness, and natural temperature-regulating properties.",
    image: "/story/1.png",
    highlights: [
      "100% Traceable Organic Fibers",
      "Extra-Long Staple Cotton (35mm+) for extreme durability and softness",
      "Sustainably sourced merino and cashmere supporting local farming communities"
    ],
    details: "Our process begins at the raw fiber stage. By selecting only the longest fibers, we ensure that the spun yarn has minimal ends exposed. This reduces friction and prevents pilling, giving our fabrics a smooth, pristine surface that feels incredible against the skin and retains its shape for years.",
    specs: [
      { label: "Material Sourcing", value: "Ethical & Organic Certified" },
      { label: "Fiber Length", value: "35mm - 42mm (Extra-Long Staple)" },
      { label: "Pilling Grade", value: "4-5 (Excellent resistance)" },
      { label: "Primary Use", value: "Fine Knitwear & Premium Tees" }
    ]
  },
  "circular-knitting-machine": {
    slug: "circular-knitting-machine",
    stepNumber: "02",
    title: "Circular Knitting Machine Precision",
    subtitle: "Weaving structure and seamless texture",
    description: "Utilizing state-of-the-art European circular knitting machines, we weave our yarns with extreme density and uniform tension. This machinery allows us to engineer customized fabric weights and structures.",
    image: "/story/2.png",
    highlights: [
      "High-gauge knitting for structured yet breathable drapes",
      "Perfect tension control ensuring zero skewing or warping after washing",
      "Custom double-knit (interlock) capability for luxury weight t-shirts and hoodies"
    ],
    details: "Circular knitting is a highly technical discipline. Our machine operators fine-tune yarn tension and feed speed to create custom knits—ranging from light, airy single jerseys to dense, structured double-knits. Every meter of fabric is monitored in real-time to detect any microscopic thread deviations.",
    specs: [
      { label: "Machine Class", value: "High-Gauge Circular Knit" },
      { label: "Tension Accuracy", value: "±0.1% Electronically Controlled" },
      { label: "Available Weaves", value: "Single Jersey, Interlock, Rib Knit" },
      { label: "Monitoring System", value: "Laser Thread-Break Detectors" }
    ]
  },
  "knitted-fabric": {
    slug: "knitted-fabric",
    stepNumber: "03",
    title: "Knitted Fabric Stabilization",
    subtitle: "Preparing textiles for tailoring",
    description: "The raw knitted tubes are washed, dyed with eco-friendly non-toxic agents, and treated with softeners to achieve our signature peach-fuzz hand feel. We then stabilize the fabric to minimize future shrinkage.",
    image: "/story/3.png",
    highlights: [
      "GOTS-certified, non-toxic organic dyes",
      "Mercerized and pre-shrunk for maximum shape retention",
      "Double-brushed finish for peerless comfort"
    ],
    details: "Fabric finishing is where raw texture becomes luxury. We use bio-washing and soft-singeing processes to remove fuzz and surface lint, resulting in a cleaner look. Crucially, our pre-shrinking process ensures that your garments won't change size after standard household laundry cycles.",
    specs: [
      { label: "Dye Standard", value: "GOTS & OEKO-TEX Standard 100" },
      { label: "Shrinkage Rate", value: "Under 2.5% (Industry standard is 5%+)" },
      { label: "Finish Treatment", value: "Siliconized Soft Wash" },
      { label: "Color Fastness", value: "Grade 4.5+ (Resists fading)" }
    ]
  },
  "garment-cutting": {
    slug: "garment-cutting",
    stepNumber: "04",
    title: "Precision Garment Cutting",
    subtitle: "Sculpting modern silhouettes",
    description: "Each garment design is converted into exact CAD patterns. The stabilized fabric is meticulously layered and cut using high-precision cutting tables to ensure every piece matches the design specifications perfectly.",
    image: "/story/4.png",
    highlights: [
      "Computerized CAD pattern matching for perfect symmetry",
      "Hand-guided final cut detailing for complex sleeve caps and necklines",
      "Zero-waste layout optimization reducing fabric scrap by up to 18%"
    ],
    details: "Precision cutting is crucial for architectural tailoring. Even a deviation of a few millimeters can ruin the drape of a shoulder or cause a seam to twist. Our master cutters lay the fabric naturally to relax tension before cutting, ensuring the silhouette stays sharp and upright on the body.",
    specs: [
      { label: "Cutting Method", value: "Computerized CAD Layout & Hand Cut" },
      { label: "Accuracy Tolerance", value: "±0.5mm" },
      { label: "Grain Alignment", value: "100% Vertical & Horizontal Balance" },
      { label: "Waste Reduction", value: "18% Saved via Smart Nesting" }
    ]
  },
  "garment-manufacturing": {
    slug: "garment-manufacturing",
    stepNumber: "05",
    title: "Expert Garment Manufacturing",
    subtitle: "Assembled by master tailors",
    description: "Our garments are sewn by skilled tailors using heavy-duty flatlock and twin-needle machines. We focus on reinforced seams, clean finishes, and premium trims to construct a durable, long-lasting legacy piece.",
    image: "/story/5.png",
    highlights: [
      "Flatlock coverstitch seams for friction-free comfort and strength",
      "Hand-finished collar bands that resist stretching out",
      "Comprehensive 12-point quality check before final packaging"
    ],
    details: "The sewing room is where individual panels come together to form a masterpiece. Our tailors specialize in knitwear, using custom thread tensions that stretch dynamically with the fabric without breaking. Every single collar, hem, and sleeve cuff is inspected under high-intensity light to guarantee flawless stitching.",
    specs: [
      { label: "Stitch Type", value: "4-Needle 6-Thread Flatlock & Twin-Needle" },
      { label: "Thread Quality", value: "Gutermann Premium Polyester/Cotton" },
      { label: "Assembly Time", value: "2.5x Standard Industrial Time" },
      { label: "Quality Audit", value: "12-Point Inspection per Garment" }
    ]
  }
};

const STEP_ORDER = [
  "yarn-knitting-ball",
  "circular-knitting-machine",
  "knitted-fabric",
  "garment-cutting",
  "garment-manufacturing"
];

interface PageProps {
  params: Promise<{ step: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const stepData = STEPS_DATA[resolvedParams.step];
  if (!stepData) {
    return {
      title: "Step Not Found | Aion Luxury",
    };
  }
  return {
    title: `${stepData.title} | Production Process`,
    description: stepData.description,
  };
}

export default async function StepPage({ params }: PageProps) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.step;
  const stepData = STEPS_DATA[currentSlug];

  if (!stepData) {
    notFound();
  }

  const currentIndex = STEP_ORDER.indexOf(currentSlug);
  const prevSlug = currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : null;
  const nextSlug = currentIndex < STEP_ORDER.length - 1 ? STEP_ORDER[currentIndex + 1] : null;

  return (
    <div className={styles.container}>
      {/* Top breadcrumb & back navigation */}
      <div className={`container-app ${styles.topBar}`}>
        <Link href="/ourstory" className={styles.backLink}>
          <span className={styles.arrow}>←</span> Back to Our Story
        </Link>
    
      </div>

      {/* Main Content Grid */}
      <section className={`container-app ${styles.mainGrid}`}>
        {/* Info Column */}
        <div className={styles.infoCol}>
          {/* <h1 className={styles.title}>{stepData.title}</h1> */}
          <p className={styles.subtitle}>{stepData.subtitle}</p>
          
          <div className={styles.divider} />
          
          <p className={styles.description}>{stepData.description}</p>
          
          <div className={styles.highlightsSection}>
            <h3 className={styles.sectionTitle}>Key Highlights</h3>
            <ul className={styles.highlightsList}>
              {stepData.highlights.map((highlight, idx) => (
                <li key={idx} className={styles.highlightItem}>
                  <span className={styles.bullet}>•</span> {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>The Craft in Detail</h3>
            <p className={styles.detailsText}>{stepData.details}</p>
          </div>
        </div>

        {/* Media / Spec Column */}
        <div className={styles.mediaCol}>
          <div className={styles.imageWrapper}>
            <img 
              src={stepData.image} 
              alt={stepData.title} 
              className={styles.image}
            />
          </div>
          
          <div className={styles.specsCard}>
            <h3 className={styles.specsTitle}>Technical Specifications</h3>
            <div className={styles.specsGrid}>
              {stepData.specs.map((spec, idx) => (
                <div key={idx} className={styles.specRow}>
                  <span className={styles.specLabel}>{spec.label}</span>
                  <span className={styles.specValue}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

 
    </div>
  );
}
