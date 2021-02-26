const data = [
  {
    uuid: '1000',
    type: 'container',
    children: [
      {
        uuid: '1100',
        type: 'text'
      },
      {
        uuid: '1200',
        type: 'image'
      },
      {
        uuid: '1300',
        type: 'text'
      }
    ]
  },
  {
    uuid: '2000',
    type: 'container',
    children: [
      {
        uuid: '2100',
        type: 'image'
      },
      {
        uuid: '2200',
        type: 'container',
        children: [
          {
            uuid: '2210',
            type: 'text'
          },
          {
            uuid: '2220',
            type: 'container',
            children: [
              {
                uuid: '2221',
                type: 'image'
              },
              {
                uuid: '2222',
                type: 'image'
              }
            ]
          }
        ],
      },
    ]
  },
  {
    uuid: 12,
    type: 'container',
    children: [
      {
        uuid: 13,
        type: 'text'
      },
      {
        uuid: 14,
        type: 'text'
      }
    ]
  }
]

export default data
