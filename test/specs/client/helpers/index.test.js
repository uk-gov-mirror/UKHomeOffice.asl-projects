import assert from 'assert';
import {
  getFields
} from '../../../../client/helpers';

describe('Helpers', () => {

  it('getFields - experimental design', () => {

    const experimentalDesignSection = {
      'title': 'Protocols',
      'granted': {
        'order': 4
      },
      'name': 'protocols',
      'review': {
        'compare': null,
        'displayName': 'Connect(ProtocolsReview)'
      },
      'repeats': 'protocols',
      'fields': [
        {
          'name': 'title',
          'label': 'Title',
          'type': 'text'
        }
      ],
      'sections': {
        'experimentalDesign': {
          'title': 'Experimental design',
          'granted': {
            'order': 9
          },
          'fields': [
            {
              'name': 'outputs',
              'label': 'What outputs are expected to arise from this protocol?',
              'hint': 'For example, test results, phenotypic information, or products.',
              'type': 'texteditor'
            },
            {
              'name': 'training-outputs',
              'label': 'What learning outcomes are expected to arise from this protocol?',
              'type': 'texteditor'
            },
            {
              'name': 'quantitative-data',
              'label': 'Will this protocol generate quantitative data?',
              'type': 'radio',
              'className': 'smaller',
              'inline': true,
              'options': [
                {
                  'label': 'Yes',
                  'value': true,
                  'reveal': [
                    {
                      'name': 'quantitative-data-guideline',
                      'label': 'Will your experimental design be determined by a regulatory guideline?',
                      'type': 'radio',
                      'className': 'smaller',
                      'inline': true,
                      'options': [
                        {
                          'label': 'Yes',
                          'value': true,
                          'reveal': {
                            'name': 'quantitative-data-guideline-refined',
                            'label': 'How will you ensure that you are using the most refined methodology?',
                            'type': 'texteditor'
                          }
                        },
                        {
                          'label': 'No',
                          'value': false,
                          'reveal': [
                            {
                              'name': 'quantitative-data-pilot-studies-how',
                              'label': 'Where relevant, explain how and when pilot studies will be used.',
                              'type': 'texteditor'
                            },
                            {
                              'name': 'quantitative-data-experimental-groups',
                              'label': 'How will you choose different experimental groups?',
                              'hint': 'For example, controls, dose levels, satellites etc.',
                              'type': 'texteditor'
                            },
                            {
                              'name': 'control-groups',
                              'label': 'How will you choose control groups?',
                              'hint': 'Provide a robust scientific justification for controls with significant suffering such as sham surgery controls or untreated infected controls.',
                              'type': 'texteditor'
                            },
                            {
                              'name': 'randomised',
                              'label': 'How will experiments and data analysis be randomised and blinded?',
                              'type': 'texteditor'
                            },
                            {
                              'name': 'reproducibility',
                              'label': 'How will you minimise variables to ensure reproducibility?',
                              'type': 'texteditor'
                            },
                            {
                              'name': 'control-groups-size',
                              'label': 'How will you determine group sizes?',
                              'hint': 'You should reference POWER calculations you have made, if relevant.',
                              'type': 'texteditor'
                            },
                            {
                              'name': 'maximize-effectiveness',
                              'label': 'How will you maximise the data output from the animals you use on this protocol?',
                              'type': 'texteditor'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  'label': 'No',
                  'value': false
                }
              ]
            }
          ]
        }
      }
    };

    let fields = getFields(experimentalDesignSection);
    assert.equal(fields.length, 3);
    assert.equal(fields[0].name, 'protocols.*.outputs');
    assert.equal(fields[1].name, 'protocols.*.training-outputs');
    assert.equal(fields[2].name, 'protocols.*.quantitative-data');

    fields = getFields(experimentalDesignSection, true);
    assert.equal(fields.length, 12);
    assert.equal(fields[0].name, 'protocols.*.outputs');
    assert.equal(fields[1].name, 'protocols.*.training-outputs');
    assert.equal(fields[2].name, 'protocols.*.quantitative-data');
    assert.equal(fields[3].name, 'protocols.*.quantitative-data-guideline');
    assert.equal(fields[4].name, 'protocols.*.quantitative-data-guideline-refined');
    assert.equal(fields[5].name, 'protocols.*.quantitative-data-pilot-studies-how');
    assert.equal(fields[6].name, 'protocols.*.quantitative-data-experimental-groups');
    assert.equal(fields[7].name, 'protocols.*.control-groups');
    assert.equal(fields[8].name, 'protocols.*.randomised');
    assert.equal(fields[9].name, 'protocols.*.reproducibility');
    assert.equal(fields[10].name, 'protocols.*.control-groups-size');
    assert.equal(fields[11].name, 'protocols.*.maximize-effectiveness');
  });

  it('getFields - adverse fields', () => {

    const stepsSection = {
      'title': 'Protocols',
      'granted': {
        'order': 4
      },
      'name': 'protocols',
      'review': {
        'compare': null,
        'displayName': 'Connect(ProtocolsReview)'
      },
      'repeats': 'protocols',
      'fields': [
        {
          'name': 'title',
          'label': 'Title',
          'type': 'text'
        }
      ],
      'sections': {
        'steps': {
          'title': 'Steps',
          'hint': 'A step can be a single procedure or a combination of procedures to achieve an outcome. You will be able to reorder your steps at any time before you send your application to the Home Office, but they should be broadly chronological, with the final step being a method of killing or the last regulated procedure.',
          'footer': 'Once you’ve created a list of steps, you need to add information about adverse effects, controls and limitations, and humane endpoints to each one.',
          'repeats': 'steps',
          'granted': {
            'order': 7
          },
          'fields': [
            {
              'name': 'title',
              'type': 'texteditor',
              'label': 'Describe the procedures that will be carried out during this step.',
              'hint': 'Explain where one or more steps are repeated in one experiment, list any alternative techniques within a step (e.g. dosing routes), and include all procedures performed under terminal anaesthesia.\n\nWhen describing the technical aspects of a step, be broad enough to be flexible when the variation does not impact on animal welfare (e.g. use "antibiotic" instead of "penicillin"). Finally, avoid specifying volumes and frequencies when they do not impact on animal welfare.'
            },
            {
              'name': 'reference',
              'type': 'text',
              'label': 'Step reference',
              'hint': "Provide a short reference for this step, e.g. 'Blood sampling' or 'Transgene induction'"
            },
            {
              'name': 'optional',
              'label': 'Is this step optional?',
              'type': 'radio',
              'inline': true,
              'className': 'smaller',
              'options': [
                {
                  'label': 'Yes',
                  'value': true
                },
                {
                  'label': 'No',
                  'value': false
                }
              ]
            },
            {
              'name': 'adverse',
              'label': 'Do you expect this step to have adverse effects for the animals that are more than mild and transient?',
              'hint': 'Do not list uncommon or unlikely adverse effects, or effects from procedures that will cause no more than transient discomfort and no lasting harm. For example, an intravenous injection of a small volume of an innocuous substance.',
              'type': 'radio',
              'inline': true,
              'className': 'smaller',
              'options': [
                {
                  'label': 'Yes',
                  'value': true,
                  'reveal': [
                    {
                      'name': 'adverse-effects',
                      'label': 'What are the likely adverse effects of this step?',
                      'hint': 'State the expected adverse effect, including the likely incidence, and the anticipated degree and duration of suffering.',
                      'type': 'texteditor'
                    },
                    {
                      'name': 'prevent-adverse-effects',
                      'label': 'How will you monitor for, control, and limit any of these adverse effects?',
                      'hint': "If adverse effects can't be prevented, how will you attempt to ameliorate their initial signs?",
                      'type': 'texteditor'
                    },
                    {
                      'name': 'endpoints',
                      'label': 'What are the humane endpoints for this step?',
                      'hint': 'This would be the point at which you would kill the animal to prevent further suffering.',
                      'type': 'texteditor'
                    }
                  ]
                },
                {
                  'label': 'No',
                  'value': false
                }
              ]
            },
            {
              'name': 'reusable',
              'label': 'Do you want to be able to use this step on other protocols?',
              'type': 'radio',
              'inline': true,
              'className': 'smaller',
              'options': [
                {
                  'label': 'Yes',
                  'value': true
                },
                {
                  'label': 'No',
                  'value': false
                }
              ]
            }
          ]
        }
      }
    };

    let fields = getFields(stepsSection);
    assert.equal(fields.length, 5);
    assert.equal(fields[0].name, 'protocols.*.title');
    assert.equal(fields[1].name, 'protocols.*.reference');
    assert.equal(fields[2].name, 'protocols.*.optional');
    assert.equal(fields[3].name, 'protocols.*.adverse');
    assert.equal(fields[4].name, 'protocols.*.reusable');

    fields = getFields(stepsSection, true);
    assert.equal(fields.length, 8);
    assert.equal(fields[0].name, 'protocols.*.title');
    assert.equal(fields[1].name, 'protocols.*.reference');
    assert.equal(fields[2].name, 'protocols.*.optional');
    assert.equal(fields[3].name, 'protocols.*.adverse');
    assert.equal(fields[4].name, 'protocols.*.adverse-effects');
    assert.equal(fields[5].name, 'protocols.*.prevent-adverse-effects');
    assert.equal(fields[6].name, 'protocols.*.endpoints');
    assert.equal(fields[7].name, 'protocols.*.reusable');
  });
});
