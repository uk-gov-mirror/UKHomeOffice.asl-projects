export const hydrateSteps = (protocols, steps, reusableSteps) => {

  const reusableStepsInAllProtocols =
    (protocols || [])
      .flatMap((protocol, index) => (protocol.steps || [])
        .filter(step => !!step.reusableStepId)
        .map(step => {
          return { reusableStepId: step.reusableStepId, protocolIndex: index + 1 };
        })
      )
      .reduce((map, reusableStep) => {
        if (!map[reusableStep.reusableStepId]) {
          map[reusableStep.reusableStepId] = [];
        }
        map[reusableStep.reusableStepId].push(reusableStep.protocolIndex);
        return map;
      }, {});

  const hydratedSteps = (steps || []).filter(Boolean)
    .map(step => {
      if (step.reusableStepId) {
        const reusableStep = {
          ...reusableSteps[step.reusableStepId],
          usedInProtocols: reusableStepsInAllProtocols[step.reusableStepId],
          reusedStep: true
        };
        return { ...reusableStep, ...step };
      }
      return step;
    });

  return [hydratedSteps, Object.values(reusableSteps)];
};
