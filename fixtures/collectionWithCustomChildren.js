const data = [
  {
    id: 1,
    type: 'container',
    blocks: [
      {
        id: 2,
        type: 'text'
      },
      {
        id: 3,
        type: 'image'
      },
      {
        id: 4,
        type: 'text'
      }
    ]
  },
  {
    id: 5,
    type: 'container',
    blocks: [
      {
        id: 6,
        type: 'image'
      },
      {
        id: 7,
        type: 'container',
        blocks: [
          {
            id: 8,
            type: 'text'
          },
          {
            id: 9,
            type: 'container',
            blocks: [
              {
                id: 10,
                type: 'image'
              },
              {
                id: 11,
                type: 'image'
              }
            ]
          }
        ],
      },
    ]
  },
  {
    id: 12,
    type: 'container',
    blocks: [
      {
        id: 13,
        type: 'text'
      },
      {
        id: 14,
        type: 'text'
      }
    ]
  }
]

export default data
