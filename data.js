var customData = {},
  demoData = {
    /*windowWidth: 1024,*/
    /*windowHeight: 768,*/
    sentenceLine1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    sentenceLine2: '',
    sentenceX: 20,
    sentenceY: 180,
    fontSize: 14,
    /*sentenceUrl: '',*/
    xFix: -60,
    yFix: -50,
    trials: [
      /******************
       * trial 1
       ******************/
      [{
          duration: 200,
          x: 100,
          y: 200,
          type: 'fixation'
            // word: 'Lorem'
        }, {
          duration: 50,
          x1: 100,
          x2: 200,
          y: 200,
          type: 'saccade'
        },
        /*{
             duration: 200,
             x: 100,
             y: 200,
             type: 'fixation'
             // word: 'ipsum'
           }, {
             duration: 50,
             x1: 100,
             x2: 200,
             y: 200,
             type: 'saccade'
           }, */
        {
          duration: 240,
          x: 200,
          y: 200,
          type: 'fixation'
            // word: 'dolor'
        }, {
          duration: 28,
          x1: 200,
          x2: 248,
          y: 200,
          type: 'saccade'
        }, {
          duration: 220,
          x: 248,
          y: 200,
          type: 'fixation'
            // word: 'sit'
        }, {
          duration: 45,
          x1: 248,
          x2: 280,
          y: 200,
          type: 'saccade'
        }, {
          duration: 234,
          x: 280,
          y: 200,
          type: 'fixation'
            // word: 'amet'
        }, {
          duration: 20,
          x1: 280,
          x2: 342,
          y: 200,
          type: 'saccade'
        }, {
          duration: 340,
          x: 342,
          y: 200,
          type: 'fixation'
            // word: 'consectetur'
        }, {
          duration: 40,
          x1: 342,
          x2: 405,
          y: 200,
          type: 'saccade'
        }, {
          duration: 285,
          x: 405,
          y: 200,
          type: 'fixation'
            // word: 'consectetur'
        }, {
          duration: 41,
          x1: 405,
          x2: 450,
          y: 200,
          type: 'saccade'
        }, {
          duration: 232,
          x: 450,
          y: 200,
          type: 'fixation'
            // word: 'adipiscing'
        }, {
          duration: 26,
          x1: 450,
          x2: 490,
          y: 200,
          type: 'saccade'
        }, {
          duration: 340,
          x: 490,
          y: 200,
          type: 'fixation'
            // word: 'adipiscing'
        }, {
          duration: 43,
          x1: 490,
          x2: 532,
          y: 200,
          type: 'saccade'
        }, {
          duration: 296,
          x: 532,
          y: 200,
          type: 'fixation'
            // word: 'elit'
        }
      ],
      /******************
       * trial 2
       ******************/
      [{
        duration: 219,
        x: 95,
        y: 200,
        type: 'fixation'
          // word: 'Lorem'
      }, {
        duration: 50,
        x1: 95,
        x2: 145,
        y: 200,
        type: 'saccade'
      }, {
        duration: 200,
        x: 145,
        y: 200,
        type: 'fixation'
          // word: 'ipsum'
      }, {
        duration: 50,
        x1: 145,
        x2: 209.1,
        y: 200,
        type: 'saccade'
      }, {
        duration: 245,
        x: 209.1,
        y: 200,
        type: 'fixation'
          // word: 'dolor'
      }, {
        duration: 32,
        x1: 209.1,
        x2: 244,
        y: 200,
        type: 'saccade'
      }, {
        duration: 229,
        x: 244,
        y: 200,
        type: 'fixation'
          // word: 'sit'
      }, {
        duration: 43,
        x1: 244,
        x2: 286,
        y: 200,
        type: 'saccade'
      }, {
        duration: 254,
        x: 286,
        y: 200,
        type: 'fixation'
          // word: 'amet'
      }, {
        duration: 22,
        x1: 286,
        x2: 342,
        y: 200,
        type: 'saccade'
      }, {
        duration: 349,
        x: 342,
        y: 200,
        type: 'fixation'
          // word: 'consectetur'
      }, {
        duration: 42,
        x1: 342,
        x2: 401.2,
        y: 200,
        type: 'saccade'
      }, {
        duration: 284,
        x: 401.2,
        y: 200,
        type: 'fixation'
          // word: 'consectetur'
      }, {
        duration: 41,
        x1: 401.2,
        x2: 444,
        y: 200,
        type: 'saccade'
      }, {
        duration: 303,
        x: 444,
        y: 200,
        type: 'fixation'
          // word: 'adipiscing'
      }, {
        duration: 26,
        x1: 444,
        x2: 487,
        y: 200,
        type: 'saccade'
      }, {
        duration: 450,
        x: 487,
        y: 200,
        type: 'fixation'
          // word: 'adipiscing'
      }, {
        duration: 43,
        x1: 487,
        x2: 535,
        y: 200,
        type: 'saccade'
      }, {
        duration: 312,
        x: 535,
        y: 200,
        type: 'fixation'
          // word: 'elit'
      }],
      /******************
       * trial 3
       ******************/
      [{
          duration: 179,
          x: 102,
          y: 200,
          type: 'fixation'
            // word: 'Lorem'
        }, {
          duration: 34,
          x1: 102,
          x2: 148.9,
          y: 200,
          type: 'saccade'
        }, {
          duration: 165,
          x: 148.9,
          y: 200,
          type: 'fixation'
            // word: 'ipsum'
        }, {
          duration: 50,
          x1: 148.9,
          x2: 211,
          y: 200,
          type: 'saccade'
        }, {
          duration: 245,
          x: 211,
          y: 200,
          type: 'fixation'
            // word: 'dolor'
        }, {
          duration: 32,
          x1: 211,
          x2: 248.9,
          y: 200,
          type: 'saccade'
        }, {
          duration: 230,
          x: 248.9,
          y: 200,
          type: 'fixation'
            // word: 'sit'
        }, {
          duration: 43,
          x1: 248.9,
          x2: 289.8,
          y: 200,
          type: 'saccade'
        }, {
          duration: 274,
          x: 289.8,
          y: 200,
          type: 'fixation'
            // word: 'amet'
        }, {
          duration: 22,
          x1: 289.8,
          x2: 344.3,
          y: 200,
          type: 'saccade'
        }, {
          duration: 378.7,
          x: 344.3,
          y: 200,
          type: 'fixation'
            // word: 'consectetur'
        }, {
          duration: 42,
          x1: 344.3,
          x2: 398.4,
          y: 200,
          type: 'saccade'
        }, {
          duration: 260,
          x: 398.4,
          y: 200,
          type: 'fixation'
            // word: 'consectetur'
        }, {
          duration: 48.9,
          x1: 398.4,
          x2: 462,
          y: 200,
          type: 'saccade'
        }, {
          duration: 382.3,
          x: 462,
          y: 200,
          type: 'fixation'
            // word: 'adipiscing'
        },
        /* {
              duration: 26,
              x1: 444,
              x2: 487,
              y: 200,
              type: 'saccade'
            }, {
              duration: 450,
              x: 487,
              y: 200,
              type: 'fixation'
                // word: 'adipiscing'
            },*/
        {
          duration: 43,
          x1: 462,
          x2: 530.9,
          y: 200,
          type: 'saccade'
        }, {
          duration: 343,
          x: 530.9,
          y: 200,
          type: 'fixation'
            // word: 'elit'
        }
      ]

    ]
  };
