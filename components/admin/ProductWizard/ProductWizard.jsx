"use client";

import { WizardProvider, useWizard } from "./WizardContext";
import WizardLayout from "./WizardLayout";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Details from "./Step2Details";
import Step3Classification from "./Step3Classification";
import Step4Media from "./Step4Media";
import Step5Variants from "./Step5Variants";
import Step6Bundle from "./Step6Bundle";
import Step7Shipping from "./Step7Shipping";
import Step8Policies from "./Step8Policies";
import Step9SEO from "./Step9SEO";
import Step10Publish from "./Step10Publish";

function WizardSteps() {
  const { currentStep } = useWizard();

  switch (currentStep) {
    case 1: return <Step1BasicInfo />;
    case 2: return <Step2Details />;
    case 3: return <Step3Classification />;
    case 4: return <Step4Media />;
    case 5: return <Step5Variants />;
    case 6: return <Step6Bundle />;
    case 7: return <Step7Shipping />;
    case 8: return <Step8Policies />;
    case 9: return <Step9SEO />;
    case 10: return <Step10Publish />;
    default: return <div></div>;
  }
}

export default function ProductWizard({ initialData }) {
  return (
    <WizardProvider initialData={initialData}>
      <WizardLayout>
        <WizardSteps />
      </WizardLayout>
    </WizardProvider>
  );
}