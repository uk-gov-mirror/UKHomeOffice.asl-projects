import assert from 'assert';
import helper from '../../../client/helpers/clean-protocols';

describe('clean-protocols', () => {

  it('removes unused establishments from protocols', () => {
    const project = {
      title: 'Test project',
      objectives: [],
      protocols: [
        {
          locations: [
            'University of Cheese',
            'University of Croydon',
            'University of Life'
          ],
          objectives: []
        }
      ]
    };
    const props = {
      establishments: [
        { 'establishment-name': 'University of Croydon' }
      ]
    };
    const establishment = {
      name: 'University of Cheese'
    };
    assert.deepEqual(helper(project, props, establishment), {
      title: 'Test project',
      objectives: [],
      establishments: [
        { 'establishment-name': 'University of Croydon' }
      ],
      protocols: [
        {
          locations: [
            'University of Cheese',
            'University of Croydon'
          ],
          objectives: []
        }
      ]
    });
  });

  it('does not throw an error if project has no objectives', () => {
    const project = {
      title: 'Test project',
      protocols: []
    };
    const props = {
      establishments: [
        { 'establishment-name': 'University of Croydon' }
      ]
    };
    const establishment = {
      name: 'University of Cheese'
    };
    assert.deepEqual(helper(project, props, establishment), {
      title: 'Test project',
      protocols: [],
      establishments: [
        { 'establishment-name': 'University of Croydon' }
      ]
    });
  });

});
