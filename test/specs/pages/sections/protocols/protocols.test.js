import assert from 'assert';
import {getNewComments, filterProtocolComments} from '../../../../../client/helpers';

const commentsSeenByAuthor = {
  'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.steps.a5c888a7-8700-4674-9bd3-29c0013ee37d.title': [
    {
      'id': '96f4522e-1543-4c7c-af69-bc35cea7396f',
      'field': 'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.steps.a5c888a7-8700-4674-9bd3-29c0013ee37d.title',
      'comment': 'Comment on step3 (not reused)',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:07:44.784Z',
      'author': 'Inspector Morse',
      'isNew': false,
      'isMine': true
    }
  ],
  'reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.optional': [
    {
      'id': 'ceca8787-59c3-4f60-ae67-9d0f0ee2d60d',
      'field': 'reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.optional',
      'comment': 'Comment on reused step',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:07:18.983Z',
      'author': 'Inspector Morse',
      'isNew': false,
      'isMine': true
    }
  ],
  'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.description': [
    {
      'id': '7f1aab91-1a5b-4f13-9972-79a2cd2306e9',
      'field': 'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.description',
      'comment': 'Comment protocol 1 details',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:46.175Z',
      'author': 'Inspector Morse',
      'isNew': false,
      'isMine': true
    }
  ],
  'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.steps.9a7f5673-4fec-4706-8a5d-992cd4f49cb5.title': [
    {
      'id': '3277512b-23cc-4fc8-a3ad-ad16d1629a7c',
      'field': 'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.steps.9a7f5673-4fec-4706-8a5d-992cd4f49cb5.title',
      'comment': 'Unusable step comment',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:23.886Z',
      'author': 'Inspector Morse',
      'isNew': false,
      'isMine': true
    }
  ],
  'reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.title': [
    {
      'id': 'e7d838c2-4c8c-4efd-b15f-642291e7aff6',
      'field': 'reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.title',
      'comment': 'Step1 comment',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:04.415Z',
      'author': 'Inspector Morse',
      'isNew': false,
      'isMine': true
    }
  ],
  'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.description': [
    {
      'id': '3e1c2327-7da7-4b56-86c9-ccb4ed22d8a6',
      'field': 'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.description',
      'comment': 'Comment 1',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:04:36.756Z',
      'author': 'Inspector Morse',
      'isNew': false,
      'isMine': true
    }
  ]
};

const commentsSeenByRecipient = {
  'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.steps.a5c888a7-8700-4674-9bd3-29c0013ee37d.title': [
    {
      'id': '96f4522e-1543-4c7c-af69-bc35cea7396f',
      'field': 'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.steps.a5c888a7-8700-4674-9bd3-29c0013ee37d.title',
      'comment': 'Comment on step3 (not reused)',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:07:44.784Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.optional': [
    {
      'id': 'ceca8787-59c3-4f60-ae67-9d0f0ee2d60d',
      'field': 'reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.optional',
      'comment': 'Comment on reused step',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:07:18.983Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.description': [
    {
      'id': '7f1aab91-1a5b-4f13-9972-79a2cd2306e9',
      'field': 'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.description',
      'comment': 'Comment protocol 1 details',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:46.175Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.steps.9a7f5673-4fec-4706-8a5d-992cd4f49cb5.title': [
    {
      'id': '3277512b-23cc-4fc8-a3ad-ad16d1629a7c',
      'field': 'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.steps.9a7f5673-4fec-4706-8a5d-992cd4f49cb5.title',
      'comment': 'Unusable step comment',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:23.886Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.title': [
    {
      'id': 'e7d838c2-4c8c-4efd-b15f-642291e7aff6',
      'field': 'reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.title',
      'comment': 'Step1 comment',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:04.415Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.description': [
    {
      'id': '3e1c2327-7da7-4b56-86c9-ccb4ed22d8a6',
      'field': 'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.description',
      'comment': 'Comment 1',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:04:36.756Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ]
};

// The same as above, except that protocols.${protocolId} was prepended to reusable Step field ID
const commentsSeenByRecipientModified = {
  'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.steps.a5c888a7-8700-4674-9bd3-29c0013ee37d.title': [
    {
      'id': '96f4522e-1543-4c7c-af69-bc35cea7396f',
      'field': 'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.steps.a5c888a7-8700-4674-9bd3-29c0013ee37d.title',
      'comment': 'Comment on step3 (not reused)',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:07:44.784Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.optional': [
    {
      'id': 'ceca8787-59c3-4f60-ae67-9d0f0ee2d60d',
      'field': 'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.optional',
      'comment': 'Comment on reused step',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:07:18.983Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.description': [
    {
      'id': '7f1aab91-1a5b-4f13-9972-79a2cd2306e9',
      'field': 'protocols.f35e4d89-6f3f-469a-8616-d2975191a9e4.description',
      'comment': 'Comment protocol 1 details',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:46.175Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.steps.9a7f5673-4fec-4706-8a5d-992cd4f49cb5.title': [
    {
      'id': '3277512b-23cc-4fc8-a3ad-ad16d1629a7c',
      'field': 'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.steps.9a7f5673-4fec-4706-8a5d-992cd4f49cb5.title',
      'comment': 'Unusable step comment',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:23.886Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.title': [
    {
      'id': 'e7d838c2-4c8c-4efd-b15f-642291e7aff6',
      'field': 'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.reusableSteps.6d350c54-c0e3-4462-aa1b-a99e633d4d86.title',
      'comment': 'Step1 comment',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:05:04.415Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ],
  'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.description': [
    {
      'id': '3e1c2327-7da7-4b56-86c9-ccb4ed22d8a6',
      'field': 'protocols.4aaac223-b0ed-47f2-b3a0-6a50bc4a7d42.description',
      'comment': 'Comment 1',
      'createdAt': '2023-08-22T09:09:00.494Z',
      'timestamp': '2023-08-22T09:04:36.756Z',
      'author': 'Inspector Morse',
      'isNew': true,
      'isMine': false
    }
  ]
};

describe('New Comments', () => {

  it('User who raised comments don\'t see them as new', () => {
    const newComments = getNewComments(commentsSeenByAuthor, 'Inspector Morse');

    assert.equal(Object.keys(newComments).length, 6);
    Object.values(newComments).forEach((stepComments) => {
      assert.equal(stepComments.length, 0);
    });
  });

  it('Count seen by recipient of comments should include comments on reusable steps', () => {
    const newComments = getNewComments(commentsSeenByRecipient, 'Bruce Banner');

    assert.equal(Object.keys(newComments).length, 6);
    Object.values(newComments).forEach((stepComments) => {
      assert.equal(stepComments.length, 1);
    });
    const protocolComments = filterProtocolComments(newComments, 'f35e4d89-6f3f-469a-8616-d2975191a9e4');

    assert.equal(Object.keys(protocolComments).length, 3);
  });

  it('Proof of Fix - Count seen by recipient of comments should include comments on reusable steps', () => {
    const newComments = getNewComments(commentsSeenByRecipientModified, 'Bruce Banner');
    // const newComments = getNewComments(commentsSeenByRecipientModified, 'Bruce Banner');

    assert.equal(Object.keys(newComments).length, 6);
    Object.values(newComments).forEach((stepComments) => {
      assert.equal(stepComments.length, 1);
    });
    const protocolComments = filterProtocolComments(newComments, 'f35e4d89-6f3f-469a-8616-d2975191a9e4');

    assert.equal(Object.keys(protocolComments).length, 3);
  });

});
