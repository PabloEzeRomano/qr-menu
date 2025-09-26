'use client'

import { useOnboarding } from '@/contexts/OnboardingProvider'
import {
  RestaurantSetup,
  CategoriesSetup,
  ItemsSetup,
  FiltersSetup,
  OnboardingComplete,
} from './index'

const STEP_COMPONENTS = {
  RestaurantSetup,
  CategoriesSetup,
  ItemsSetup,
  FiltersSetup,
  OnboardingComplete,
}

export default function OnboardingFlow() {
  const { currentStep, steps, previousStep, goToStep } = useOnboarding()

  const currentStepData = steps[currentStep]
  const CurrentComponent =
    STEP_COMPONENTS[currentStepData.component as keyof typeof STEP_COMPONENTS]

  return (
    <div className="calc(min-h-screen - 64px) bg-gray-50 mt-16">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(index)}
                    disabled={index > currentStep}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === currentStep
                        ? 'bg-indigo-600 text-white'
                        : index < currentStep
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                    } ${index <= currentStep ? 'cursor-pointer hover:bg-opacity-80' : 'cursor-not-allowed'}`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${
                        index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* <div className="text-sm text-gray-500">
              Paso {currentStep + 1} de {steps.length}
            </div> */}
          </div>

          <div className="text-center">
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-168px)]">
        <CurrentComponent />
      </div>

      {/* Optional step indicator */}
      {currentStepData.isOptional && (
        <div className="bg-orange-50 border-t border-orange-200">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="text-center">
              <span className="text-orange-600 text-sm font-medium">• Paso opcional</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
