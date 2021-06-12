const counties = require('./list')

module.exports = {
  v1: function (request, reply) {
    let list = counties

    if (request.params.filter) {
      if (!/^(name|capital|code)$/.test(request.params.filter)) {
        reply.notFound()

        return
      }

      switch (request.params.filter) {
        case 'name': {
          list = list.filter(county => county.name.toLowerCase().replace(/\s+/g, '-') === request.params.value)
          break
        }
        case 'capital': {
          list = list.filter(county => county.capital.find(capital => capital.toLowerCase().replace(/\s+/g, '-') === request.params.value))
          break
        }
        case 'code': {
          list = list.filter(county => county.code === request.params.value)

          break
        }
      }
    }

    if (typeof request.query.fields === 'string') {
      const fields = request.query.fields.split(',')

      list = list.map(county => {
        const obj = {}

        fields.forEach(field => {
          if (county[field]) {
            obj[field] = county[field]
          }
        })

        return obj
      })
    }

    reply.send(list)
  }
}
