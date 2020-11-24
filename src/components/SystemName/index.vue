<template>
  <div>
    <div>
      <el-input v-model="keyword" type="text" placeholder="输入系统名字" style="width: 350px;" />
    </div>
    <div v-show="keyword" ref="search" style="width: 370px;">
      <ul>
        <li v-for="item of list" v-show="hasSelected" :key="item.label" class="search-item border-bottom" @click="handleSystemNameClick(item)">{{ item.label }}
        </li>
        <li v-show="hasNoData" class="search-item border-bottom">没有找到匹配的系统名称
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import systemNameAPI from '@/api/knlge/systemname'
export default {
  name: 'SystemName',
  props: {
    systemNameFather: String
  },
  data() {
    return {
      systemNameIdTotal: [],
      keyword: '',
      list: [],
      timer: null,
      hasSelected: true
      // selected: {
      //   sysId:null,
      //   sysName:null
      // }
    }
  },
  computed: {
    hasNoData() {
      if (this.systemNameFather) {
        return false
      }
      return !this.list.length
    }
  },
  watch: {
    // keyword改名的话，程序执行拿不到正确的结果，说明v-model绑定的keyword应该是要把名字写成一样的。
    // keyword () {} 改为 keyword : function () {},程序执行有正确的结果。说明这种写法，应该是一种简写。这两种都是函数定义的写法。
    // 只不过你这个函数是在watch里面的，所以函数名必须要和变量名一样才能监听。
    // setTimeout()只会执行一次，但是我把setTimeout()放在watch里边，只要里边的变量发生变化，setTimeout()就会再次执行。
    keyword: function() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (!this.keyword) {
        this.list = []
        return
      }
      // 奔奔觉得在setTimeout()函数里边this会不生效，所以用了这个that。
      const that = this
      this.timer = setTimeout(() => {
        const result = []
        this.systemNameIdTotal.forEach((value) => {
          if (value.label.indexOf(this.keyword) > -1) {
            result.push(value)
          }
        })
        this.list = result
        that.hasSelected = true
      }, 100)
    },
    systemNameFather() {
      this.keyword = this.systemNameFather
    }
  },
  mounted() {
    this.keyword = this.systemNameFather
    // this.scroll = new Bscroll(this.$refs.search)，曾经在这里出过问题，systemNameAPI，这个变量之前加了this，导致mounted没有成功。
    // axios.get('api/areasystem/systemall')直接使用axios没有带有token，后端会报错。
    systemNameAPI.getSystemNames().then((res) => {
      if (res) {
        const content = res
        this.systemNameIdTotal = []
        for (const i in content) {
          this.systemNameIdTotal.push({
            label: content[i].sysName,
            value: content[i].sysId
          })
        }
      }
    }
    )
  },
  methods: {
    handleSystemNameClick(selectItem) {
      this.keyword = selectItem.label
      this.$emit('getSysId', selectItem)
      console.log(selectItem)
      // this.changeSelected()
      this.hasSelected = false
    }
    // changeSelected () {
    //   console.log("hasSelected已经执行")
    //   this.hasSelected = !this.hasSelected
    // }
  }
}
</script>

<style scoped>

</style>
