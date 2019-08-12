import DataHandle from '../../util/DataHandle';

class ChangeTitle extends DataHandle{
  constructor(){
    super('changeTitle')
    this.title = ''
    this.interval = null
    this.timeout = null
    this.statusList = []
    this.currentStatus = []
  }
  init () {
    this.title = document.title
  }
  addStatus (json) {
    if (json.name && this.statusList.filter(item => item.name == json.name).length > 0) {
      this.statusList = this.statusList.map(item => {
        if (item.name == json.name) {
          item = {
            title: json.title || '',
            blinkTitle: json.blinkTitle || '',
            name: json.name || ''
          }
        }
        return item
      }, [])
    } else {
      this.statusList.push({
        title: json.title || '',
        blinkTitle: json.blinkTitle || '',
        name: json.name || ''
      })
    }
  }
  change (name) {
    if (this.currentStatus.indexOf(name) == -1) {
      this.currentStatus.push(name)
    }
    this.check()
  }
  reset (name) {
    if (this.currentStatus.indexOf(name) > -1) {
      this.currentStatus.splice(this.currentStatus.indexOf(name), 1)
    }
    this.check()
  }
  check () {
    if (this.interval) {
      clearInterval(this.interval)
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    var curList = this.statusList.filter(item =>  this.currentStatus.indexOf(item.name) > -1)
    if (curList.length > 0) {
      var cur = curList[0]
      if (cur.blinkTitle != '' && cur.title != cur.blinkTitle) {
        this.interval = setInterval(() => {
          document.title = (cur.title).replace('$title', this.title)
          this.timeout = setTimeout(() => {
            document.title = (cur.blinkTitle).replace('$title', this.title)
          }, 500)
        }, 1000)
      } else {
        document.title = (cur.title).replace('$title', this.title)
      }
    } else if (document.title != this.title) {
      document.title = (this.title)
    }
  }
}

export default new ChangeTitle()
