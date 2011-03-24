var vows = require('vows');
vows.describe('Cosmos').addBatch({
  'Is Cool': {
    topic: true,
    'Confirmed Cool': function(){}
  }
}).export(module);
