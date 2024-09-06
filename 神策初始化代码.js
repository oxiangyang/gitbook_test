 //该方法在app.js中，在启动时会多次调用

// 测试1

// 测试2
 getToken() {
    return new ZMPromise((resolve, reject) => {
      this.request({
        url: url,
        data: {},
        noLoading: true,
        method: 'GET',
        success: async res => {
          const isMember = Boolean(res.code === 0 && res.data);
          const properties = { is_member_status: isMember };
          registerProperties.hookRegister(function ({event, props, data}) {
            return properties;
          });
          sensors.registerApp(properties);
          if (isMember) {
            // 迪卡侬会员
            // 设置personid
            sensors.identify(res.data.unionid, true);
            sensors.login(res.data.person_id);
          } else {
            // 拿不到personid则设置unionid
            const unionId = wx.getStorageSync('union_id');
            sensors.identify(unionId, true);
          }
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
        complete(resp) {
          // 需要在sensors.identify()后执行，否则神策会定义uuid()为distinct_id，无法将用户关联
          sensors.init();
        },
      });
    })
  },
