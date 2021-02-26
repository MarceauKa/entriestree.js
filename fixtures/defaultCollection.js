const data = [
  {
    id: 1,
    type: 'container',
    children: [
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
    children: [
      {
        id: 6,
        type: 'image'
      },
      {
        id: 7,
        type: 'container',
        children: [
          {
            id: 8,
            type: 'text'
          },
          {
            id: 9,
            type: 'container',
            children: [
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
    children: [
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
