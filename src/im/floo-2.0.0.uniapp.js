!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define("floo", [], t)
    : "object" == typeof exports
    ? (exports.floo = t())
    : (e.floo = t());
})("undefined" != typeof self ? self : this, function () {
  return (function (e) {
    var t = {};
    function n(r) {
      if (t[r]) return t[r].exports;
      var o = (t[r] = { i: r, l: !1, exports: {} });
      return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    return (
      (n.m = e),
      (n.c = t),
      (n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
      }),
      (n.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (n.t = function (e, t) {
        if ((1 & t && (e = n(e)), 8 & t)) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, "default", { enumerable: !0, value: e }),
          2 & t && "string" != typeof e)
        )
          for (var o in e)
            n.d(
              r,
              o,
              function (t) {
                return e[t];
              }.bind(null, o)
            );
        return r;
      }),
      (n.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return n.d(t, "a", t), t;
      }),
      (n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (n.p = ""),
      n((n.s = 48))
    );
  })([
    function (e, t, n) {
      e.exports = (function () {
        var e = {};
        function t(t, n, r) {
          return (
            "function" == typeof n
              ? ((r = n), (n = new e.Root()))
              : n || (n = new e.Root()),
            n.load(t, r)
          );
        }
        function r(t, n) {
          return n || (n = new e.Root()), n.loadSync(t);
        }
        function o(t, n, r) {
          return (
            "function" == typeof n
              ? ((r = n), (n = new e.Root()))
              : n || (n = new e.Root()),
            n.parseFromPbString(t, r)
          );
        }
        function i() {
          e.converter._configure(),
            e.decoder._configure(),
            e.encoder._configure(),
            e.Field._configure(),
            e.MapField._configure(),
            e.Message._configure(),
            e.Namespace._configure(),
            e.Method._configure(),
            e.ReflectionObject._configure(),
            e.OneOf._configure(),
            e.parse._configure(),
            e.Reader._configure(),
            e.Root._configure(),
            e.Service._configure(),
            e.verifier._configure(),
            e.Type._configure(),
            e.types._configure(),
            e.wrappers._configure(),
            e.Writer._configure();
        }
        if (
          ((e.build = "minimal"),
          (e.Writer = n(19)),
          (e.encoder = n(28)),
          (e.Reader = n(26)),
          (e.util = n(1)),
          (e.rpc = n(24)),
          (e.roots = n(20)),
          (e.verifier = n(27)),
          (e.tokenize = n(23)),
          (e.parse = n(22)),
          (e.common = n(25)),
          (e.ReflectionObject = n(7)),
          (e.Namespace = n(9)),
          (e.Root = n(12)),
          (e.Enum = n(4)),
          (e.Type = n(6)),
          (e.Field = n(5)),
          (e.OneOf = n(10)),
          (e.MapField = n(16)),
          (e.Service = n(13)),
          (e.Method = n(17)),
          (e.converter = n(31)),
          (e.decoder = n(29)),
          (e.Message = n(18)),
          (e.wrappers = n(30)),
          (e.types = n(8)),
          (e.util = n(1)),
          (e.configure = i),
          (e.load = t),
          (e.loadSync = r),
          (e.parseFromPbString = o),
          i(),
          arguments && arguments.length)
        )
          for (var s = 0; s < arguments.length; s++) {
            var a = arguments[s];
            if (a.hasOwnProperty("exports")) return void (a.exports = e);
          }
        return e;
      })();
    },
    function (e, t, n) {
      var r = e.exports,
        o = n(20);
      (r.LongBits = n(15)),
        (r.Long = n(42)),
        (r.pool = n(43)),
        (r.float = n(44)),
        (r.asPromise = n(45)),
        (r.EventEmitter = n(46)),
        (r.path = n(47)),
        (r.base64 = n(21)),
        (r.utf8 = n(11)),
        (r.compareFieldsById = function (e, t) {
          return e.id - t.id;
        }),
        (r.toArray = function (e) {
          if (e) {
            for (
              var t = Object.keys(e), n = new Array(t.length), r = 0;
              r < t.length;

            )
              n[r] = e[t[r++]];
            return n;
          }
          return [];
        }),
        (r.toObject = function (e) {
          for (var t = {}, n = 0; n < e.length; ) {
            var r = e[n++],
              o = e[n++];
            void 0 !== o && (t[r] = o);
          }
          return t;
        }),
        (r.isString = function (e) {
          return "string" == typeof e || e instanceof String;
        });
      (r.isReserved = function (e) {
        return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(
          e
        );
      }),
        (r.isObject = function (e) {
          return e && "object" == typeof e;
        }),
        (r.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array),
        (r.oneOfGetter = function (e) {
          for (var t = {}, n = 0; n < e.length; ++n) t[e[n]] = 1;
          return function () {
            for (var e = Object.keys(this), n = e.length - 1; n > -1; --n)
              if (1 === t[e[n]] && void 0 !== this[e[n]] && null !== this[e[n]])
                return e[n];
          };
        }),
        (r.oneOfSetter = function (e) {
          return function (t) {
            for (var n = 0; n < e.length; ++n) e[n] !== t && delete this[e[n]];
          };
        }),
        (r.merge = function (e, t, n) {
          for (var r = Object.keys(t), o = 0; o < r.length; ++o)
            (void 0 !== e[r[o]] && n) || (e[r[o]] = t[r[o]]);
          return e;
        }),
        (r.decorateType = function (e, t) {
          if (e.$type)
            return (
              t &&
                e.$type.name !== t &&
                (r.decorateRoot.remove(e.$type),
                (e.$type.name = t),
                r.decorateRoot.add(e.$type)),
              e.$type
            );
          Type || (Type = n(6));
          var o = new Type(t || e.name);
          return (
            r.decorateRoot.add(o),
            (o.ctor = e),
            Object.defineProperty(e, "$type", { value: o, enumerable: !1 }),
            Object.defineProperty(e.prototype, "$type", {
              value: o,
              enumerable: !1,
            }),
            o
          );
        }),
        (r.emptyArray = Object.freeze ? Object.freeze([]) : []),
        (r.emptyObject = Object.freeze ? Object.freeze({}) : {}),
        (r.longToHash = function (e) {
          return e ? r.LongBits.from(e).toHash() : r.LongBits.zeroHash;
        }),
        (r.copy = function (e) {
          if ("object" != typeof e) return e;
          var t = {};
          for (var n in e) t[n] = e[n];
          return t;
        }),
        (r.deepCopy = function e(t) {
          if ("object" != typeof t) return t;
          var n = {};
          for (var r in t) n[r] = e(t[r]);
          return n;
        }),
        (r.ProtocolError = function (e) {
          function t(e, n) {
            if (!(this instanceof t)) return new t(e, n);
            Object.defineProperty(this, "message", {
              get: function () {
                return e;
              },
            }),
              Error.captureStackTrace
                ? Error.captureStackTrace(this, t)
                : Object.defineProperty(this, "stack", {
                    value: new Error().stack || "",
                  }),
              n && merge(this, n);
          }
          return (
            ((t.prototype = Object.create(Error.prototype)).constructor = t),
            Object.defineProperty(t.prototype, "name", {
              get: function () {
                return e;
              },
            }),
            (t.prototype.toString = function () {
              return this.name + ": " + this.message;
            }),
            t
          );
        }),
        (r.toJSONOptions = {
          longs: String,
          enums: String,
          bytes: String,
          json: !0,
        }),
        (r.Buffer = null),
        (r.newBuffer = function (e) {
          return "number" == typeof e
            ? new r.Array(e)
            : "undefined" == typeof Uint8Array
            ? e
            : new Uint8Array(e);
        }),
        (r.stringToBytes = function (e) {
          var t,
            n,
            r = [];
          t = e.length;
          for (var o = 0; o < t; o++)
            (n = e.charCodeAt(o)) >= 65536 && n <= 1114111
              ? (r.push(((n >> 18) & 7) | 240),
                r.push(((n >> 12) & 63) | 128),
                r.push(((n >> 6) & 63) | 128),
                r.push((63 & n) | 128))
              : n >= 2048 && n <= 65535
              ? (r.push(((n >> 12) & 15) | 224),
                r.push(((n >> 6) & 63) | 128),
                r.push((63 & n) | 128))
              : n >= 128 && n <= 2047
              ? (r.push(((n >> 6) & 31) | 192), r.push((63 & n) | 128))
              : r.push(255 & n);
          return r;
        }),
        (r.byteToString = function (e) {
          if ("string" == typeof e) return e;
          for (var t = "", n = e, r = 0; r < n.length; r++) {
            var o = n[r].toString(2),
              i = o.match(/^1+?(?=0)/);
            if (i && 8 == o.length) {
              for (
                var s = i[0].length, a = n[r].toString(2).slice(7 - s), u = 1;
                u < s;
                u++
              )
                a += n[u + r].toString(2).slice(2);
              (t += String.fromCharCode(parseInt(a, 2))), (r += s - 1);
            } else t += String.fromCharCode(n[r]);
          }
          return t;
        }),
        (r.isInteger =
          Number.isInteger ||
          function (e) {
            return "number" == typeof e && isFinite(e) && Math.floor(e) === e;
          }),
        Object.defineProperty(r, "decorateRoot", {
          get: function () {
            return o.decorated || (o.decorated = new (n(12))());
          },
        });
    },
    function (e, t, n) {
      var r, o, i;
      (o = [n(0)]),
        void 0 ===
          (i =
            "function" ==
            typeof (r = function (e) {
              "use strict";
              return (e.roots.xsync || (e.roots.xsync = new e.Root())).addJSON({
                im: {
                  nested: {
                    floo: {
                      nested: {
                        protobuf: {
                          nested: {
                            Frame: {
                              fields: {
                                vsn: { type: "VSN", id: 1 },
                                compress_method: {
                                  type: "CompressMethod",
                                  id: 2,
                                },
                                command: { type: "Command", id: 3 },
                                payload: { type: "bytes", id: 4 },
                                encrypt_method: {
                                  type: "EncryptMethod",
                                  id: 5,
                                },
                                encrypt_key: { type: "bytes", id: 6 },
                                check_sum: { type: "uint32", id: 7 },
                                tag: { type: "string", id: 8 },
                              },
                              nested: {
                                VSN: { values: { XSYNC_V1: 0, XSYNC_V2: 1 } },
                                Command: {
                                  values: {
                                    UNREAD: 0,
                                    SYNC: 1,
                                    NOTICE: 2,
                                    PROVISION: 3,
                                  },
                                },
                                CompressMethod: {
                                  values: { NONE: 0, ZLIB: 1 },
                                },
                                EncryptMethod: {
                                  values: {
                                    ENCRYPT_NONE: 0,
                                    AES_CBC_128: 1,
                                    AES_CBC_256: 2,
                                    CUSTOM: 3,
                                  },
                                },
                              },
                            },
                            Status: {
                              fields: {
                                code: { type: "ErrorCode", id: 1 },
                                reason: { type: "string", id: 2 },
                              },
                              nested: {
                                ErrorCode: {
                                  values: {
                                    UNKNOWN: 0,
                                    OK: 1,
                                    FAIL: 2,
                                    UNKNOWN_COMMAND: 3,
                                    PB_PARSER_ERROR: 4,
                                    DECRYPT_FAILURE: 5,
                                    PUBLIC_KEY_CHANGED: 6,
                                    INVALID_TOKEN: 7,
                                    INVALID_PARAMETER: 8,
                                    UNAUTHORIZED: 9,
                                    USER_FROZEN: 10,
                                    USER_BANNED: 11,
                                    WORD_CENSORED: 12,
                                    TOO_MANY_DEVICES: 13,
                                    ENCRYPT_METHOD_UNSUPPORTED: 14,
                                    DEVICE_GUID_CONFLICT: 15,
                                    CHECK_SUM_FAILURE: 16,
                                    INVALID_LICENSE: 17,
                                    LICENSE_LIMIT: 18,
                                    APP_FROZEN: 19,
                                  },
                                },
                              },
                            },
                            ConversationUnread: {
                              fields: {
                                xid: { type: "XID", id: 1 },
                                n: { type: "uint32", id: 2 },
                                type: { type: "ConvType", id: 3 },
                              },
                              nested: {
                                ConvType: {
                                  values: { UNKNOWN: 0, CHAT: 1, GROUPCHAT: 2 },
                                },
                              },
                            },
                            UnreadUL: { fields: {} },
                            UnreadDL: {
                              fields: {
                                status: { type: "Status", id: 1 },
                                unread: {
                                  rule: "repeated",
                                  type: "ConversationUnread",
                                  id: 2,
                                },
                              },
                            },
                            SyncUL: {
                              fields: {
                                xid: { type: "XID", id: 1 },
                                key: { type: "uint64", id: 2 },
                                meta: { type: "Meta", id: 3 },
                                is_full_sync: { type: "bool", id: 4 },
                                full_sync_num: { type: "sint32", id: 5 },
                              },
                            },
                            SyncDL: {
                              fields: {
                                status: { type: "Status", id: 1 },
                                metas: {
                                  rule: "repeated",
                                  type: "Meta",
                                  id: 2,
                                },
                                next_key: { type: "uint64", id: 3 },
                                xid: { type: "XID", id: 4 },
                                client_mid: { type: "uint64", id: 5 },
                                server_mid: { type: "uint64", id: 6 },
                                server_time: { type: "uint64", id: 7 },
                                is_full_sync: { type: "bool", id: 8 },
                                prev_mid: { type: "uint64", id: 9 },
                                is_eager_sync: { type: "bool", id: 10 },
                              },
                            },
                            Notice: { fields: { xid: { type: "XID", id: 1 } } },
                            Provision: {
                              fields: {
                                status: { type: "Status", id: 1 },
                                xid: { type: "XID", id: 2 },
                                password: { type: "string", id: 5 },
                                token: { type: "string", id: 6 },
                                os_type: { type: "OsType", id: 7 },
                                sdk_vsn: { type: "string", id: 8 },
                                is_manual_login: { type: "bool", id: 9 },
                                device_guid: { type: "string", id: 10 },
                                device_notifier: { type: "string", id: 11 },
                                device_token: { type: "string", id: 12 },
                                device_info: { type: "string", id: 13 },
                                last_login_time: { type: "uint64", id: 14 },
                              },
                              nested: {
                                OsType: {
                                  values: {
                                    UNKNOWN: 0,
                                    IOS: 1,
                                    ANDR: 2,
                                    WIN: 3,
                                    OSX: 4,
                                    LINUX: 5,
                                    WEB: 6,
                                  },
                                },
                              },
                            },
                            Meta: {
                              fields: {
                                id: { type: "uint64", id: 1 },
                                from: { type: "XID", id: 2 },
                                to: { type: "XID", id: 3 },
                                timestamp: { type: "uint64", id: 4 },
                                ns: { type: "NameSpace", id: 5 },
                                payload: { type: "bytes", id: 6 },
                              },
                              nested: {
                                NameSpace: {
                                  values: {
                                    UNKNOWN: 0,
                                    MESSAGE: 1,
                                    GROUP_NOTICE: 2,
                                    ROSTER_NOTICE: 3,
                                    USER_NOTICE: 4,
                                    INFO: 5,
                                    CONVERSATION: 6,
                                    PUSH: 7,
                                  },
                                },
                              },
                            },
                            XID: {
                              fields: {
                                uid: { type: "uint64", id: 1 },
                                deviceSN: { type: "uint32", id: 2 },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            })
              ? r.apply(t, o)
              : r) || (e.exports = i);
    },
    function (e, t) {
      e.exports = r;
      var n = null;
      try {
        n = new WebAssembly.Instance(
          new WebAssembly.Module(
            new Uint8Array([
              0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127,
              127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1,
              65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95,
              115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95,
              115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95,
              104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1,
              1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32,
              3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32,
              4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134,
              132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32,
              135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1,
              173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132,
              128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1,
              126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3,
              173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4,
              167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132,
              32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135,
              167, 36, 0, 32, 4, 167, 11,
            ])
          ),
          {}
        ).exports;
      } catch (e) {}
      function r(e, t, n) {
        (this.low = 0 | e), (this.high = 0 | t), (this.unsigned = !!n);
      }
      function o(e) {
        return !0 === (e && e.__isLong__);
      }
      r.prototype.__isLong__,
        Object.defineProperty(r.prototype, "__isLong__", { value: !0 }),
        (r.isLong = o);
      var i = {},
        s = {};
      function a(e, t) {
        var n, r, o;
        return t
          ? (o = 0 <= (e >>>= 0) && e < 256) && (r = s[e])
            ? r
            : ((n = c(e, (0 | e) < 0 ? -1 : 0, !0)), o && (s[e] = n), n)
          : (o = -128 <= (e |= 0) && e < 128) && (r = i[e])
          ? r
          : ((n = c(e, e < 0 ? -1 : 0, !1)), o && (i[e] = n), n);
      }
      function u(e, t) {
        if (isNaN(e)) return t ? v : m;
        if (t) {
          if (e < 0) return v;
          if (e >= h) return A;
        } else {
          if (e <= -g) return w;
          if (e + 1 >= g) return b;
        }
        return e < 0 ? u(-e, t).neg() : c(e % f | 0, (e / f) | 0, t);
      }
      function c(e, t, n) {
        return new r(e, t, n);
      }
      (r.fromInt = a), (r.fromNumber = u), (r.fromBits = c);
      var d = Math.pow;
      function l(e, t, n) {
        if (0 === e.length) throw Error("empty string");
        if (
          "NaN" === e ||
          "Infinity" === e ||
          "+Infinity" === e ||
          "-Infinity" === e
        )
          return m;
        if (
          ("number" == typeof t ? ((n = t), (t = !1)) : (t = !!t),
          (n = n || 10) < 2 || 36 < n)
        )
          throw RangeError("radix");
        var r;
        if ((r = e.indexOf("-")) > 0) throw Error("interior hyphen");
        if (0 === r) return l(e.substring(1), t, n).neg();
        for (var o = u(d(n, 8)), i = m, s = 0; s < e.length; s += 8) {
          var a = Math.min(8, e.length - s),
            c = parseInt(e.substring(s, s + a), n);
          if (a < 8) {
            var p = u(d(n, a));
            i = i.mul(p).add(u(c));
          } else i = (i = i.mul(o)).add(u(c));
        }
        return (i.unsigned = t), i;
      }
      function p(e, t) {
        return "number" == typeof e
          ? u(e, t)
          : "string" == typeof e
          ? l(e, t)
          : c(e.low, e.high, "boolean" == typeof t ? t : e.unsigned);
      }
      (r.fromString = l), (r.fromValue = p);
      var f = 4294967296,
        h = f * f,
        g = h / 2,
        y = a(1 << 24),
        m = a(0);
      r.ZERO = m;
      var v = a(0, !0);
      r.UZERO = v;
      var _ = a(1);
      r.ONE = _;
      var E = a(1, !0);
      r.UONE = E;
      var N = a(-1);
      r.NEG_ONE = N;
      var b = c(-1, 2147483647, !1);
      r.MAX_VALUE = b;
      var A = c(-1, -1, !0);
      r.MAX_UNSIGNED_VALUE = A;
      var w = c(0, -2147483648, !1);
      r.MIN_VALUE = w;
      var O = r.prototype;
      (O.toInt = function () {
        return this.unsigned ? this.low >>> 0 : this.low;
      }),
        (O.toNumber = function () {
          return this.unsigned
            ? (this.high >>> 0) * f + (this.low >>> 0)
            : this.high * f + (this.low >>> 0);
        }),
        (O.toString = function (e) {
          if ((e = e || 10) < 2 || 36 < e) throw RangeError("radix");
          if (this.isZero()) return "0";
          if (this.isNegative()) {
            if (this.eq(w)) {
              var t = u(e),
                n = this.div(t),
                r = n.mul(t).sub(this);
              return n.toString(e) + r.toInt().toString(e);
            }
            return "-" + this.neg().toString(e);
          }
          for (var o = u(d(e, 6), this.unsigned), i = this, s = ""; ; ) {
            var a = i.div(o),
              c = (i.sub(a.mul(o)).toInt() >>> 0).toString(e);
            if ((i = a).isZero()) return c + s;
            for (; c.length < 6; ) c = "0" + c;
            s = "" + c + s;
          }
        }),
        (O.getHighBits = function () {
          return this.high;
        }),
        (O.getHighBitsUnsigned = function () {
          return this.high >>> 0;
        }),
        (O.getLowBits = function () {
          return this.low;
        }),
        (O.getLowBitsUnsigned = function () {
          return this.low >>> 0;
        }),
        (O.getNumBitsAbs = function () {
          if (this.isNegative())
            return this.eq(w) ? 64 : this.neg().getNumBitsAbs();
          for (
            var e = 0 != this.high ? this.high : this.low, t = 31;
            t > 0 && 0 == (e & (1 << t));
            t--
          );
          return 0 != this.high ? t + 33 : t + 1;
        }),
        (O.isZero = function () {
          return 0 === this.high && 0 === this.low;
        }),
        (O.eqz = O.isZero),
        (O.isNegative = function () {
          return !this.unsigned && this.high < 0;
        }),
        (O.isPositive = function () {
          return this.unsigned || this.high >= 0;
        }),
        (O.isOdd = function () {
          return 1 == (1 & this.low);
        }),
        (O.isEven = function () {
          return 0 == (1 & this.low);
        }),
        (O.equals = function (e) {
          return (
            o(e) || (e = p(e)),
            (this.unsigned === e.unsigned ||
              this.high >>> 31 != 1 ||
              e.high >>> 31 != 1) &&
              this.high === e.high &&
              this.low === e.low
          );
        }),
        (O.eq = O.equals),
        (O.notEquals = function (e) {
          return !this.eq(e);
        }),
        (O.neq = O.notEquals),
        (O.ne = O.notEquals),
        (O.lessThan = function (e) {
          return this.comp(e) < 0;
        }),
        (O.lt = O.lessThan),
        (O.lessThanOrEqual = function (e) {
          return this.comp(e) <= 0;
        }),
        (O.lte = O.lessThanOrEqual),
        (O.le = O.lessThanOrEqual),
        (O.greaterThan = function (e) {
          return this.comp(e) > 0;
        }),
        (O.gt = O.greaterThan),
        (O.greaterThanOrEqual = function (e) {
          return this.comp(e) >= 0;
        }),
        (O.gte = O.greaterThanOrEqual),
        (O.ge = O.greaterThanOrEqual),
        (O.compare = function (e) {
          if ((o(e) || (e = p(e)), this.eq(e))) return 0;
          var t = this.isNegative(),
            n = e.isNegative();
          return t && !n
            ? -1
            : !t && n
            ? 1
            : this.unsigned
            ? e.high >>> 0 > this.high >>> 0 ||
              (e.high === this.high && e.low >>> 0 > this.low >>> 0)
              ? -1
              : 1
            : this.sub(e).isNegative()
            ? -1
            : 1;
        }),
        (O.comp = O.compare),
        (O.negate = function () {
          return !this.unsigned && this.eq(w) ? w : this.not().add(_);
        }),
        (O.neg = O.negate),
        (O.add = function (e) {
          o(e) || (e = p(e));
          var t = this.high >>> 16,
            n = 65535 & this.high,
            r = this.low >>> 16,
            i = 65535 & this.low,
            s = e.high >>> 16,
            a = 65535 & e.high,
            u = e.low >>> 16,
            d = 0,
            l = 0,
            f = 0,
            h = 0;
          return (
            (f += (h += i + (65535 & e.low)) >>> 16),
            (l += (f += r + u) >>> 16),
            (d += (l += n + a) >>> 16),
            (d += t + s),
            c(
              ((f &= 65535) << 16) | (h &= 65535),
              ((d &= 65535) << 16) | (l &= 65535),
              this.unsigned
            )
          );
        }),
        (O.subtract = function (e) {
          return o(e) || (e = p(e)), this.add(e.neg());
        }),
        (O.sub = O.subtract),
        (O.multiply = function (e) {
          if (this.isZero()) return m;
          if ((o(e) || (e = p(e)), n))
            return c(
              n.mul(this.low, this.high, e.low, e.high),
              n.get_high(),
              this.unsigned
            );
          if (e.isZero()) return m;
          if (this.eq(w)) return e.isOdd() ? w : m;
          if (e.eq(w)) return this.isOdd() ? w : m;
          if (this.isNegative())
            return e.isNegative()
              ? this.neg().mul(e.neg())
              : this.neg().mul(e).neg();
          if (e.isNegative()) return this.mul(e.neg()).neg();
          if (this.lt(y) && e.lt(y))
            return u(this.toNumber() * e.toNumber(), this.unsigned);
          var t = this.high >>> 16,
            r = 65535 & this.high,
            i = this.low >>> 16,
            s = 65535 & this.low,
            a = e.high >>> 16,
            d = 65535 & e.high,
            l = e.low >>> 16,
            f = 65535 & e.low,
            h = 0,
            g = 0,
            v = 0,
            _ = 0;
          return (
            (v += (_ += s * f) >>> 16),
            (g += (v += i * f) >>> 16),
            (v &= 65535),
            (g += (v += s * l) >>> 16),
            (h += (g += r * f) >>> 16),
            (g &= 65535),
            (h += (g += i * l) >>> 16),
            (g &= 65535),
            (h += (g += s * d) >>> 16),
            (h += t * f + r * l + i * d + s * a),
            c(
              ((v &= 65535) << 16) | (_ &= 65535),
              ((h &= 65535) << 16) | (g &= 65535),
              this.unsigned
            )
          );
        }),
        (O.mul = O.multiply),
        (O.divide = function (e) {
          if ((o(e) || (e = p(e)), e.isZero())) throw Error("division by zero");
          var t, r, i;
          if (n)
            return this.unsigned ||
              -2147483648 !== this.high ||
              -1 !== e.low ||
              -1 !== e.high
              ? c(
                  (this.unsigned ? n.div_u : n.div_s)(
                    this.low,
                    this.high,
                    e.low,
                    e.high
                  ),
                  n.get_high(),
                  this.unsigned
                )
              : this;
          if (this.isZero()) return this.unsigned ? v : m;
          if (this.unsigned) {
            if ((e.unsigned || (e = e.toUnsigned()), e.gt(this))) return v;
            if (e.gt(this.shru(1))) return E;
            i = v;
          } else {
            if (this.eq(w))
              return e.eq(_) || e.eq(N)
                ? w
                : e.eq(w)
                ? _
                : (t = this.shr(1).div(e).shl(1)).eq(m)
                ? e.isNegative()
                  ? _
                  : N
                : ((r = this.sub(e.mul(t))), (i = t.add(r.div(e))));
            if (e.eq(w)) return this.unsigned ? v : m;
            if (this.isNegative())
              return e.isNegative()
                ? this.neg().div(e.neg())
                : this.neg().div(e).neg();
            if (e.isNegative()) return this.div(e.neg()).neg();
            i = m;
          }
          for (r = this; r.gte(e); ) {
            t = Math.max(1, Math.floor(r.toNumber() / e.toNumber()));
            for (
              var s = Math.ceil(Math.log(t) / Math.LN2),
                a = s <= 48 ? 1 : d(2, s - 48),
                l = u(t),
                f = l.mul(e);
              f.isNegative() || f.gt(r);

            )
              f = (l = u((t -= a), this.unsigned)).mul(e);
            l.isZero() && (l = _), (i = i.add(l)), (r = r.sub(f));
          }
          return i;
        }),
        (O.div = O.divide),
        (O.modulo = function (e) {
          return (
            o(e) || (e = p(e)),
            n
              ? c(
                  (this.unsigned ? n.rem_u : n.rem_s)(
                    this.low,
                    this.high,
                    e.low,
                    e.high
                  ),
                  n.get_high(),
                  this.unsigned
                )
              : this.sub(this.div(e).mul(e))
          );
        }),
        (O.mod = O.modulo),
        (O.rem = O.modulo),
        (O.not = function () {
          return c(~this.low, ~this.high, this.unsigned);
        }),
        (O.and = function (e) {
          return (
            o(e) || (e = p(e)),
            c(this.low & e.low, this.high & e.high, this.unsigned)
          );
        }),
        (O.or = function (e) {
          return (
            o(e) || (e = p(e)),
            c(this.low | e.low, this.high | e.high, this.unsigned)
          );
        }),
        (O.xor = function (e) {
          return (
            o(e) || (e = p(e)),
            c(this.low ^ e.low, this.high ^ e.high, this.unsigned)
          );
        }),
        (O.shiftLeft = function (e) {
          return (
            o(e) && (e = e.toInt()),
            0 == (e &= 63)
              ? this
              : e < 32
              ? c(
                  this.low << e,
                  (this.high << e) | (this.low >>> (32 - e)),
                  this.unsigned
                )
              : c(0, this.low << (e - 32), this.unsigned)
          );
        }),
        (O.shl = O.shiftLeft),
        (O.shiftRight = function (e) {
          return (
            o(e) && (e = e.toInt()),
            0 == (e &= 63)
              ? this
              : e < 32
              ? c(
                  (this.low >>> e) | (this.high << (32 - e)),
                  this.high >> e,
                  this.unsigned
                )
              : c(this.high >> (e - 32), this.high >= 0 ? 0 : -1, this.unsigned)
          );
        }),
        (O.shr = O.shiftRight),
        (O.shiftRightUnsigned = function (e) {
          if ((o(e) && (e = e.toInt()), 0 === (e &= 63))) return this;
          var t = this.high;
          return e < 32
            ? c((this.low >>> e) | (t << (32 - e)), t >>> e, this.unsigned)
            : c(32 === e ? t : t >>> (e - 32), 0, this.unsigned);
        }),
        (O.shru = O.shiftRightUnsigned),
        (O.shr_u = O.shiftRightUnsigned),
        (O.toSigned = function () {
          return this.unsigned ? c(this.low, this.high, !1) : this;
        }),
        (O.toUnsigned = function () {
          return this.unsigned ? this : c(this.low, this.high, !0);
        }),
        (O.toBytes = function (e) {
          return e ? this.toBytesLE() : this.toBytesBE();
        }),
        (O.toBytesLE = function () {
          var e = this.high,
            t = this.low;
          return [
            255 & t,
            (t >>> 8) & 255,
            (t >>> 16) & 255,
            t >>> 24,
            255 & e,
            (e >>> 8) & 255,
            (e >>> 16) & 255,
            e >>> 24,
          ];
        }),
        (O.toBytesBE = function () {
          var e = this.high,
            t = this.low;
          return [
            e >>> 24,
            (e >>> 16) & 255,
            (e >>> 8) & 255,
            255 & e,
            t >>> 24,
            (t >>> 16) & 255,
            (t >>> 8) & 255,
            255 & t,
          ];
        }),
        (r.fromBytes = function (e, t, n) {
          return n ? r.fromBytesLE(e, t) : r.fromBytesBE(e, t);
        }),
        (r.fromBytesLE = function (e, t) {
          return new r(
            e[0] | (e[1] << 8) | (e[2] << 16) | (e[3] << 24),
            e[4] | (e[5] << 8) | (e[6] << 16) | (e[7] << 24),
            t
          );
        }),
        (r.fromBytesBE = function (e, t) {
          return new r(
            (e[4] << 24) | (e[5] << 16) | (e[6] << 8) | e[7],
            (e[0] << 24) | (e[1] << 16) | (e[2] << 8) | e[3],
            t
          );
        });
    },
    function (e, t, n) {
      e.exports = i;
      var r = n(7);
      ((i.prototype = Object.create(r.prototype)).constructor = i).className =
        "Enum";
      var o = n(9);
      function i(e, t, n, o, i) {
        if ((r.call(this, e, n), t && "object" != typeof t))
          throw TypeError("values must be an object");
        if (
          ((this.valuesById = {}),
          (this.values = Object.create(this.valuesById)),
          (this.comment = o),
          (this.comments = i || {}),
          (this.reserved = void 0),
          t)
        )
          for (var s = Object.keys(t), a = 0; a < s.length; ++a)
            "number" == typeof t[s[a]] &&
              (this.valuesById[(this.values[s[a]] = t[s[a]])] = s[a]);
      }
      (i.fromJSON = function (e, t) {
        var n = new i(e, t.values, t.options, t.comment, t.comments);
        return (n.reserved = t.reserved), n;
      }),
        (i.prototype.toJSON = function (e) {
          var t = !!e && Boolean(e.keepComments);
          return util.toObject([
            "options",
            this.options,
            "values",
            this.values,
            "reserved",
            this.reserved && this.reserved.length ? this.reserved : void 0,
            "comment",
            t ? this.comment : void 0,
            "comments",
            t ? this.comments : void 0,
          ]);
        }),
        (i.prototype.add = function (e, t, n) {
          if (!util.isString(e)) throw TypeError("name must be a string");
          if (!util.isInteger(t)) throw TypeError("id must be an integer");
          if (void 0 !== this.values[e])
            throw Error("duplicate name '" + e + "' in " + this);
          if (this.isReservedId(t))
            throw Error("id " + t + " is reserved in " + this);
          if (this.isReservedName(e))
            throw Error("name '" + e + "' is reserved in " + this);
          if (void 0 !== this.valuesById[t]) {
            if (!this.options || !this.options.allow_alias)
              throw Error("duplicate id " + t + " in " + this);
            this.values[e] = t;
          } else this.valuesById[(this.values[e] = t)] = e;
          return (this.comments[e] = n || null), this;
        }),
        (i.prototype.remove = function (e) {
          if (!util.isString(e)) throw TypeError("name must be a string");
          var t = this.values[e];
          if (null == t)
            throw Error("name '" + e + "' does not exist in " + this);
          return (
            delete this.valuesById[t],
            delete this.values[e],
            delete this.comments[e],
            this
          );
        }),
        (i.prototype.isReservedId = function (e) {
          return o.isReservedId(this.reserved, e);
        }),
        (i.prototype.isReservedName = function (e) {
          return o.isReservedName(this.reserved, e);
        });
    },
    function (e, t, n) {
      e.exports = c;
      var r,
        o,
        i,
        s,
        a = n(7);
      ((c.prototype = Object.create(a.prototype)).constructor = c).className =
        "Field";
      var u = /^required|optional|repeated$/;
      function c(e, t, n, r, s, c, d) {
        if (
          (i.isObject(r)
            ? ((d = s), (c = r), (r = s = void 0))
            : i.isObject(s) && ((d = c), (c = s), (s = void 0)),
          a.call(this, e, c),
          !i.isInteger(t) || t < 0)
        )
          throw TypeError("id must be a non-negative integer");
        if (!i.isString(n)) throw TypeError("type must be a string");
        if (void 0 !== r && !u.test((r = r.toString().toLowerCase())))
          throw TypeError("rule must be a string rule");
        if (void 0 !== s && !i.isString(s))
          throw TypeError("extend must be a string");
        (this.rule = r && "optional" !== r ? r : void 0),
          (this.type = n),
          (this.id = t),
          (this.extend = s || void 0),
          (this.required = "required" === r),
          (this.optional = !this.required),
          (this.repeated = "repeated" === r),
          (this.map = !1),
          (this.message = null),
          (this.partOf = null),
          (this.typeDefault = null),
          (this.defaultValue = null),
          (this.long = !!i.Long && void 0 !== o.long[n]),
          (this.bytes = "bytes" === n),
          (this.resolvedType = null),
          (this.extensionField = null),
          (this.declaringField = null),
          (this._packed = null),
          (this.comment = d);
      }
      (c.fromJSON = function (e, t) {
        return new c(e, t.id, t.type, t.rule, t.extend, t.options, t.comment);
      }),
        Object.defineProperty(c.prototype, "packed", {
          get: function () {
            return (
              null === this._packed &&
                (this._packed = !1 !== this.getOption("packed")),
              this._packed
            );
          },
        }),
        (c.prototype.setOption = function (e, t, n) {
          return (
            "packed" === e && (this._packed = null),
            a.prototype.setOption.call(this, e, t, n)
          );
        }),
        (c.prototype.toJSON = function (e) {
          var t = !!e && Boolean(e.keepComments);
          return i.toObject([
            "rule",
            ("optional" !== this.rule && this.rule) || void 0,
            "type",
            this.type,
            "id",
            this.id,
            "extend",
            this.extend,
            "options",
            this.options,
            "comment",
            t ? this.comment : void 0,
          ]);
        }),
        (c.prototype.resolve = function () {
          if (this.resolved) return this;
          if (
            (void 0 === (this.typeDefault = o.defaults[this.type]) &&
              ((this.resolvedType = (
                this.declaringField ? this.declaringField.parent : this.parent
              ).lookupTypeOrEnum(this.type)),
              this.resolvedType instanceof s
                ? (this.typeDefault = null)
                : (this.typeDefault =
                    this.resolvedType.values[
                      Object.keys(this.resolvedType.values)[0]
                    ])),
            this.options &&
              null != this.options.default &&
              ((this.typeDefault = this.options.default),
              this.resolvedType instanceof r &&
                "string" == typeof this.typeDefault &&
                (this.typeDefault =
                  this.resolvedType.values[this.typeDefault])),
            this.options &&
              ((!0 !== this.options.packed &&
                (void 0 === this.options.packed ||
                  !this.resolvedType ||
                  this.resolvedType instanceof r)) ||
                delete this.options.packed,
              Object.keys(this.options).length || (this.options = void 0)),
            this.long)
          )
            (this.typeDefault = i.Long.fromNumber(
              this.typeDefault,
              "u" === this.type.charAt(0)
            )),
              Object.freeze && Object.freeze(this.typeDefault);
          else if (this.bytes && "string" == typeof this.typeDefault) {
            var e;
            i.utf8.write(
              this.typeDefault,
              (e = i.newBuffer(i.utf8.length(this.typeDefault))),
              0
            ),
              (this.typeDefault = e);
          }
          return (
            this.map
              ? (this.defaultValue = i.emptyObject)
              : this.repeated
              ? (this.defaultValue = i.emptyArray)
              : (this.defaultValue = this.typeDefault),
            this.parent instanceof s &&
              (this.parent.ctor.prototype[this.name] = this.defaultValue),
            a.prototype.resolve.call(this)
          );
        }),
        (c.d = function (e, t, n, r) {
          return (
            "function" == typeof t
              ? (t = i.decorateType(t).name)
              : t && "object" == typeof t && (t = i.decorateEnum(t).name),
            function (o, s) {
              i.decorateType(o.constructor).add(
                new c(s, e, t, n, { default: r })
              );
            }
          );
        }),
        (c._configure = function () {
          (s = n(6)), (r = n(4)), (o = n(8)), (i = n(1));
        });
    },
    function (e, t, n) {
      e.exports = v;
      var r,
        o,
        i,
        s,
        a,
        u,
        c,
        d,
        l,
        p,
        f,
        h,
        g,
        y,
        m = n(9);
      function v(e, t) {
        m.call(this, e, t),
          (this.fields = {}),
          (this.oneofs = void 0),
          (this.extensions = void 0),
          (this.reserved = void 0),
          (this.group = void 0),
          (this._fieldsById = null),
          (this._fieldsArray = null),
          (this._oneofsArray = null),
          (this._ctor = null);
      }
      function _(e) {
        return (
          (e._fieldsById = e._fieldsArray = e._oneofsArray = null),
          delete e.encode,
          delete e.decode,
          delete e.verify,
          e
        );
      }
      (((v.prototype = Object.create(m.prototype)).constructor = v).className =
        "Type"),
        Object.defineProperties(v.prototype, {
          fieldsById: {
            get: function () {
              if (this._fieldsById) return this._fieldsById;
              this._fieldsById = {};
              for (var e = Object.keys(this.fields), t = 0; t < e.length; ++t) {
                var n = this.fields[e[t]],
                  r = n.id;
                if (this._fieldsById[r])
                  throw Error("duplicate id " + r + " in " + this);
                this._fieldsById[r] = n;
              }
              return this._fieldsById;
            },
          },
          fieldsArray: {
            get: function () {
              return (
                this._fieldsArray ||
                (this._fieldsArray = c.toArray(this.fields))
              );
            },
          },
          oneofsArray: {
            get: function () {
              return (
                this._oneofsArray ||
                (this._oneofsArray = c.toArray(this.oneofs))
              );
            },
          },
          ctor: {
            get: function () {
              return this._ctor || (this.ctor = v.generateConstructor(this));
            },
            set: function (e) {
              var t = e.prototype;
              t instanceof i ||
                (((e.prototype = new i()).constructor = e),
                c.merge(e.prototype, t)),
                (e.$type = e.prototype.$type = this),
                c.merge(e, i, !0),
                c.merge(e.prototype, i, !0),
                (this._ctor = e);
              for (var n = 0; n < this.fieldsArray.length; ++n)
                this._fieldsArray[n].resolve();
              var r = {};
              for (n = 0; n < this.oneofsArray.length; ++n) {
                var o = this._oneofsArray[n].resolve().name,
                  s = (function (e) {
                    for (var t = {}, n = 0; n < e.length; ++n) t[e[n]] = 0;
                    return {
                      setter: function (n) {
                        if (!(e.indexOf(n) < 0)) {
                          t[n] = 1;
                          for (var r = 0; r < e.length; ++r)
                            e[r] !== n && delete this[e[r]];
                        }
                      },
                      getter: function () {
                        for (
                          var e = Object.keys(this), n = e.length - 1;
                          n > -1;
                          --n
                        )
                          if (
                            1 === t[e[n]] &&
                            void 0 !== this[e[n]] &&
                            null !== this[e[n]]
                          )
                            return e[n];
                      },
                    };
                  })(this._oneofsArray[n].oneof);
                r[o] = { get: s.getter, set: s.setter };
              }
              n && Object.defineProperties(e.prototype, r);
            },
          },
        }),
        (v.generateConstructor = function (e) {
          return function (t) {
            for (var n, r = 0; r < e.fieldsArray.length; r++)
              (n = e._fieldsArray[r]).map
                ? (this[n.name] = {})
                : n.repeated && (this[n.name] = []);
            if (t)
              for (var o = Object.keys(t), i = 0; i < o.length; ++i)
                null != t[o[i]] && (this[o[i]] = t[o[i]]);
          };
        }),
        (v.fromJSON = function (e, t) {
          var n = new v(e, t.options);
          (n.extensions = t.extensions), (n.reserved = t.reserved);
          for (var i = Object.keys(t.fields), a = 0; a < i.length; ++a)
            n.add(
              (void 0 !== t.fields[i[a]].keyType ? y.fromJSON : o.fromJSON)(
                i[a],
                t.fields[i[a]]
              )
            );
          if (t.oneofs)
            for (i = Object.keys(t.oneofs), a = 0; a < i.length; ++a)
              n.add(s.fromJSON(i[a], t.oneofs[i[a]]));
          if (t.nested)
            for (i = Object.keys(t.nested), a = 0; a < i.length; ++a) {
              var u = t.nested[i[a]];
              n.add(
                (void 0 !== u.id
                  ? o.fromJSON
                  : void 0 !== u.fields
                  ? v.fromJSON
                  : void 0 !== u.values
                  ? r.fromJSON
                  : void 0 !== u.methods
                  ? f.fromJSON
                  : m.fromJSON)(i[a], u)
              );
            }
          return (
            t.extensions &&
              t.extensions.length &&
              (n.extensions = t.extensions),
            t.reserved && t.reserved.length && (n.reserved = t.reserved),
            t.group && (n.group = !0),
            t.comment && (n.comment = t.comment),
            n
          );
        }),
        (v.prototype.toJSON = function (e) {
          var t = m.prototype.toJSON.call(this, e),
            n = !!e && Boolean(e.keepComments);
          return {
            options: (t && t.options) || void 0,
            oneofs: m.arrayToJSON(this.oneofsArray, e),
            fields:
              m.arrayToJSON(
                this.fieldsArray.filter(function (e) {
                  return !e.declaringField;
                }),
                e
              ) || {},
            extensions:
              this.extensions && this.extensions.length
                ? this.extensions
                : void 0,
            reserved:
              this.reserved && this.reserved.length ? this.reserved : void 0,
            group: this.group || void 0,
            nested: (t && t.nested) || void 0,
            comment: n ? this.comment : void 0,
          };
        }),
        (v.prototype.resolveAll = function () {
          for (var e = this.fieldsArray, t = 0; t < e.length; )
            e[t++].resolve();
          var n = this.oneofsArray;
          for (t = 0; t < n.length; ) n[t++].resolve();
          return m.prototype.resolveAll.call(this);
        }),
        (v.prototype.get = function (e) {
          return (
            this.fields[e] ||
            (this.oneofs && this.oneofs[e]) ||
            (this.nested && this.nested[e]) ||
            null
          );
        }),
        (v.prototype.add = function (e) {
          if (this.get(e.name))
            throw Error("duplicate name '" + e.name + "' in " + this);
          if (e instanceof o && void 0 === e.extend) {
            if (this._fieldsById && this._fieldsById[e.id])
              throw Error("duplicate id " + e.id + " in " + this);
            if (this.isReservedId(e.id))
              throw Error("id " + e.id + " is reserved in " + this);
            if (this.isReservedName(e.name))
              throw Error("name '" + e.name + "' is reserved in " + this);
            return (
              e.parent && e.parent.remove(e),
              (this.fields[e.name] = e),
              (e.message = this),
              e.onAdd(this),
              _(this)
            );
          }
          return e instanceof s
            ? (this.oneofs || (this.oneofs = {}),
              (this.oneofs[e.name] = e),
              e.onAdd(this),
              _(this))
            : m.prototype.add.call(this, e);
        }),
        (v.prototype.remove = function (e) {
          if (e instanceof o && void 0 === e.extend) {
            if (!this.fields || this.fields[e.name] !== e)
              throw Error(e + " is not a member of " + this);
            return (
              delete this.fields[e.name],
              (e.parent = null),
              e.onRemove(this),
              _(this)
            );
          }
          if (e instanceof s) {
            if (!this.oneofs || this.oneofs[e.name] !== e)
              throw Error(e + " is not a member of " + this);
            return (
              delete this.oneofs[e.name],
              (e.parent = null),
              e.onRemove(this),
              _(this)
            );
          }
          return m.prototype.remove.call(this, e);
        }),
        (v.prototype.isReservedId = function (e) {
          return m.isReservedId(this.reserved, e);
        }),
        (v.prototype.isReservedName = function (e) {
          return m.isReservedName(this.reserved, e);
        }),
        (v.prototype.create = function (e) {
          return new this.ctor(e);
        }),
        (v.prototype.setup = function () {
          for (
            var e = this.fullName, t = [], n = 0;
            n < this.fieldsArray.length;
            ++n
          )
            t.push(this._fieldsArray[n].resolve().resolvedType);
          (this.encode = l(this)({ Writer: a, types: t, util: c })),
            (this.decode = p(this)({ Reader: u, types: t, util: c })),
            (this.verify = d(this)({ types: t, util: c })),
            (this.fromObject = g.fromObject(this)({ types: t, util: c })),
            (this.toObject = g.toObject(this)({ types: t, util: c }));
          var r = h[e];
          if (r) {
            var o = Object.create(this);
            (o.fromObject = this.fromObject),
              (this.fromObject = r.fromObject.bind(o)),
              (o.toObject = this.toObject),
              (this.toObject = r.toObject.bind(o));
          }
          return this;
        }),
        (v.prototype.encode = function (e, t) {
          return this.setup().encode(e, t);
        }),
        (v.prototype.encodeDelimited = function (e, t) {
          return this.encode(e, t && t.len ? t.fork() : t).ldelim();
        }),
        (v.prototype.decode = function (e, t) {
          return this.setup().decode(e, t);
        }),
        (v.prototype.decodeDelimited = function (e) {
          return (
            e instanceof u || (e = u.create(e)), this.decode(e, e.uint32())
          );
        }),
        (v.prototype.verify = function (e) {
          return this.setup().verify(e);
        }),
        (v.prototype.fromObject = function (e) {
          return this.setup().fromObject(e);
        }),
        (v.prototype.toObject = function (e, t) {
          return this.setup().toObject(e, t);
        }),
        (v.d = function (e) {
          return function (t) {
            c.decorateType(t, e);
          };
        }),
        (v._configure = function () {
          (r = n(4)),
            (o = n(5)),
            (i = n(18)),
            (s = n(10)),
            (a = n(19)),
            (u = n(26)),
            (c = n(1)),
            (d = n(27)),
            (l = n(28)),
            (p = n(29)),
            (f = n(13)),
            (h = n(30)),
            (g = n(31)),
            (y = n(16));
        });
    },
    function (e, t, n) {
      "use strict";
      var r, o;
      function i(e, t) {
        if (!r.isString(e)) throw TypeError("name must be a string");
        if (t && !r.isObject(t)) throw TypeError("options must be an object");
        (this.options = t),
          (this.name = e),
          (this.parent = null),
          (this.resolved = !1),
          (this.comment = null),
          (this.filename = null);
      }
      (e.exports = i),
        (i.className = "ReflectionObject"),
        Object.defineProperties(i.prototype, {
          root: {
            get: function () {
              for (var e = this; null !== e.parent; ) e = e.parent;
              return e;
            },
          },
          fullName: {
            get: function () {
              for (var e = [this.name], t = this.parent; t; )
                e.unshift(t.name), (t = t.parent);
              return e.join(".");
            },
          },
        }),
        (i.prototype.toJSON = function () {
          throw Error();
        }),
        (i.prototype.onAdd = function (e) {
          this.parent && this.parent !== e && this.parent.remove(this),
            (this.parent = e),
            (this.resolved = !1);
          var t = e.root;
          t instanceof o && t._handleAdd(this);
        }),
        (i.prototype.onRemove = function (e) {
          var t = e.root;
          t instanceof o && t._handleRemove(this),
            (this.parent = null),
            (this.resolved = !1);
        }),
        (i.prototype.resolve = function () {
          return (
            this.resolved || (this.root instanceof o && (this.resolved = !0)),
            this
          );
        }),
        (i.prototype.getOption = function (e) {
          if (this.options) return this.options[e];
        }),
        (i.prototype.setOption = function (e, t, n) {
          return (
            (n && this.options && void 0 !== this.options[e]) ||
              ((this.options || (this.options = {}))[e] = t),
            this
          );
        }),
        (i.prototype.setOptions = function (e, t) {
          if (e)
            for (var n = Object.keys(e), r = 0; r < n.length; ++r)
              this.setOption(n[r], e[n[r]], t);
          return this;
        }),
        (i.prototype.toString = function () {
          var e = this.constructor.className,
            t = this.fullName;
          return t.length ? e + " " + t : e;
        }),
        (i._configure = function (e) {
          (o = n(12)), (r = n(1));
        });
    },
    function (e, t, n) {
      "use strict";
      var r = e.exports,
        o = n(1),
        i = [
          "double",
          "float",
          "int32",
          "uint32",
          "sint32",
          "fixed32",
          "sfixed32",
          "int64",
          "uint64",
          "sint64",
          "fixed64",
          "sfixed64",
          "bool",
          "string",
          "bytes",
        ];
      function s(e, t) {
        var n = 0,
          r = {};
        for (t |= 0; n < e.length; ) r[i[n + t]] = e[n++];
        return r;
      }
      (r.basic = s([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2])),
        (r.defaults = s([
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          !1,
          "",
          o.emptyArray,
          null,
        ])),
        (r.long = s([0, 0, 0, 1, 1], 7)),
        (r.mapKey = s([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2)),
        (r.packed = s([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0])),
        (r._configure = function () {
          o = n(1);
        });
    },
    function (e, t, n) {
      e.exports = d;
      var r,
        o,
        i,
        s,
        a,
        u = n(7);
      function c(e, t) {
        if (e && e.length) {
          for (var n = {}, r = 0; r < e.length; ++r)
            n[e[r].name] = e[r].toJSON(t);
          return n;
        }
      }
      function d(e, t) {
        u.call(this, e, t), (this.nested = void 0), (this._nestedArray = null);
      }
      function l(e) {
        return (e._nestedArray = null), e;
      }
      (((d.prototype = Object.create(u.prototype)).constructor = d).className =
        "Namespace"),
        (d.fromJSON = function (e, t) {
          return new d(e, t.options).addJSON(t.nested);
        }),
        (d.arrayToJSON = c),
        (d.isReservedId = function (e, t) {
          if (e)
            for (var n = 0; n < e.length; ++n)
              if ("string" != typeof e[n] && e[n][0] <= t && e[n][1] >= t)
                return !0;
          return !1;
        }),
        (d.isReservedName = function (e, t) {
          if (e) for (var n = 0; n < e.length; ++n) if (e[n] === t) return !0;
          return !1;
        }),
        Object.defineProperty(d.prototype, "nestedArray", {
          get: function () {
            return (
              this._nestedArray || (this._nestedArray = i.toArray(this.nested))
            );
          },
        }),
        (d.prototype.toJSON = function (e) {
          return i.toObject([
            "options",
            this.options,
            "nested",
            c(this.nestedArray, e),
          ]);
        }),
        (d.prototype.addJSON = function (e) {
          if (e)
            for (var t, n = Object.keys(e), i = 0; i < n.length; ++i)
              (t = e[n[i]]),
                this.add(
                  (void 0 !== t.fields
                    ? s.fromJSON
                    : void 0 !== t.values
                    ? r.fromJSON
                    : void 0 !== t.methods
                    ? a.fromJSON
                    : void 0 !== t.id
                    ? o.fromJSON
                    : d.fromJSON)(n[i], t)
                );
          return this;
        }),
        (d.prototype.get = function (e) {
          return (this.nested && this.nested[e]) || null;
        }),
        (d.prototype.getEnum = function (e) {
          if (this.nested && this.nested[e] instanceof r)
            return this.nested[e].values;
          throw Error("no such enum: " + e);
        }),
        (d.prototype.add = function (e) {
          if (
            !(
              (e instanceof o && void 0 !== e.extend) ||
              e instanceof s ||
              e instanceof r ||
              e instanceof a ||
              e instanceof d
            )
          )
            throw TypeError("object must be a valid nested object");
          if (this.nested) {
            var t = this.get(e.name);
            if (t) {
              if (
                !(t instanceof d && e instanceof d) ||
                t instanceof s ||
                t instanceof a
              )
                throw Error("duplicate name '" + e.name + "' in " + this);
              for (var n = t.nestedArray, i = 0; i < n.length; ++i) e.add(n[i]);
              this.remove(t),
                this.nested || (this.nested = {}),
                e.setOptions(t.options, !0);
            }
          } else this.nested = {};
          return (this.nested[e.name] = e), e.onAdd(this), l(this);
        }),
        (d.prototype.remove = function (e) {
          if (!(e instanceof u))
            throw TypeError("object must be a ReflectionObject");
          if (e.parent !== this) throw Error(e + " is not a member of " + this);
          return (
            delete this.nested[e.name],
            Object.keys(this.nested).length || (this.nested = void 0),
            e.onRemove(this),
            l(this)
          );
        }),
        (d.prototype.define = function (e, t) {
          if (i.isString(e)) e = e.split(".");
          else if (!Array.isArray(e)) throw TypeError("illegal path");
          if (e && e.length && "" === e[0])
            throw Error("path must be relative");
          for (var n = this; e.length > 0; ) {
            var r = e.shift();
            if (n.nested && n.nested[r]) {
              if (!((n = n.nested[r]) instanceof d))
                throw Error("path conflicts with non-namespace objects");
            } else n.add((n = new d(r)));
          }
          return t && n.addJSON(t), n;
        }),
        (d.prototype.resolveAll = function () {
          for (var e = this.nestedArray, t = 0; t < e.length; )
            e[t] instanceof d ? e[t++].resolveAll() : e[t++].resolve();
          return this.resolve();
        }),
        (d.prototype.lookup = function (e, t, n) {
          if (
            ("boolean" == typeof t
              ? ((n = t), (t = void 0))
              : t && !Array.isArray(t) && (t = [t]),
            i.isString(e) && e.length)
          ) {
            if ("." === e) return this.root;
            e = e.split(".");
          } else if (!e.length) return this;
          if ("" === e[0]) return this.root.lookup(e.slice(1), t);
          var r = this.get(e[0]);
          if (r) {
            if (1 === e.length) {
              if (!t || t.indexOf(r.constructor) > -1) return r;
            } else if (r instanceof d && (r = r.lookup(e.slice(1), t, !0)))
              return r;
          } else
            for (var o = 0; o < this.nestedArray.length; ++o)
              if (
                this._nestedArray[o] instanceof d &&
                (r = this._nestedArray[o].lookup(e, t, !0))
              )
                return r;
          return null === this.parent || n ? null : this.parent.lookup(e, t);
        }),
        (d.prototype.lookupType = function (e) {
          var t = this.lookup(e, [s]);
          if (!t) throw Error("no such type: " + e);
          return t;
        }),
        (d.prototype.lookupEnum = function (e) {
          var t = this.lookup(e, [r]);
          if (!t) throw Error("no such Enum '" + e + "' in " + this);
          return t;
        }),
        (d.prototype.lookupTypeOrEnum = function (e) {
          var t = this.lookup(e, [s, r]);
          if (!t) throw Error("no such Type or Enum '" + e + "' in " + this);
          return t;
        }),
        (d.prototype.lookupService = function (e) {
          var t = this.lookup(e, [a]);
          if (!t) throw Error("no such Service '" + e + "' in " + this);
          return t;
        }),
        (d._configure = function () {
          (r = n(4)), (o = n(5)), (i = n(1)), (s = n(6)), (a = n(13));
        });
    },
    function (e, t, n) {
      e.exports = s;
      var r,
        o,
        i = n(7);
      function s(e, t, n, r) {
        if (
          (Array.isArray(t) || ((n = t), (t = void 0)),
          i.call(this, e, n),
          void 0 !== t && !Array.isArray(t))
        )
          throw TypeError("fieldNames must be an Array");
        (this.oneof = t || []), (this.fieldsArray = []), (this.comment = r);
      }
      function a(e) {
        if (e.parent)
          for (var t = 0; t < e.fieldsArray.length; ++t)
            e.fieldsArray[t].parent || e.parent.add(e.fieldsArray[t]);
      }
      (((s.prototype = Object.create(i.prototype)).constructor = s).className =
        "OneOf"),
        (s.fromJSON = function (e, t) {
          return new s(e, t.oneof, t.options, t.comment);
        }),
        (s.prototype.toJSON = function (e) {
          var t = !!e && Boolean(e.keepComments);
          return o.toObject([
            "options",
            this.options,
            "oneof",
            this.oneof,
            "comment",
            t ? this.comment : void 0,
          ]);
        }),
        (s.prototype.add = function (e) {
          if (!(e instanceof r)) throw TypeError("field must be a Field");
          return (
            e.parent && e.parent !== this.parent && e.parent.remove(e),
            this.oneof.push(e.name),
            this.fieldsArray.push(e),
            (e.partOf = this),
            a(this),
            this
          );
        }),
        (s.prototype.remove = function (e) {
          if (!(e instanceof r)) throw TypeError("field must be a Field");
          var t = this.fieldsArray.indexOf(e);
          if (t < 0) throw Error(e + " is not a member of " + this);
          return (
            this.fieldsArray.splice(t, 1),
            (t = this.oneof.indexOf(e.name)) > -1 && this.oneof.splice(t, 1),
            (e.partOf = null),
            this
          );
        }),
        (s.prototype.onAdd = function (e) {
          i.prototype.onAdd.call(this, e);
          for (var t = 0; t < this.oneof.length; ++t) {
            var n = e.get(this.oneof[t]);
            n && !n.partOf && ((n.partOf = this), this.fieldsArray.push(n));
          }
          a(this);
        }),
        (s.prototype.onRemove = function (e) {
          for (var t, n = 0; n < this.fieldsArray.length; ++n)
            (t = this.fieldsArray[n]).parent && t.parent.remove(t);
          i.prototype.onRemove.call(this, e);
        }),
        (s.d = function () {
          for (
            var e = new Array(arguments.length), t = 0;
            t < arguments.length;

          )
            e[t] = arguments[t++];
          return function (t, n) {
            o.decorateType(t.constructor).add(new s(n, e)),
              Object.defineProperty(t, n, {
                get: o.oneOfGetter(e),
                set: o.oneOfSetter(e),
              });
          };
        }),
        (s._configure = function () {
          (r = n(5)), (o = n(1));
        });
    },
    function (e, t, n) {
      "use strict";
      var r = e.exports;
      (r.length = function (e) {
        for (var t = 0, n = 0, r = 0; r < e.length; ++r)
          (n = e.charCodeAt(r)) < 128
            ? (t += 1)
            : n < 2048
            ? (t += 2)
            : 55296 == (64512 & n) && 56320 == (64512 & e.charCodeAt(r + 1))
            ? (++r, (t += 4))
            : (t += 3);
        return t;
      }),
        (r.read = function (e, t, n) {
          if (n - t < 1) return "";
          for (var r, o = null, i = [], s = 0; t < n; )
            (r = e[t++]) < 128
              ? (i[s++] = r)
              : r > 191 && r < 224
              ? (i[s++] = ((31 & r) << 6) | (63 & e[t++]))
              : r > 239 && r < 365
              ? ((r =
                  (((7 & r) << 18) |
                    ((63 & e[t++]) << 12) |
                    ((63 & e[t++]) << 6) |
                    (63 & e[t++])) -
                  65536),
                (i[s++] = 55296 + (r >> 10)),
                (i[s++] = 56320 + (1023 & r)))
              : (i[s++] =
                  ((15 & r) << 12) | ((63 & e[t++]) << 6) | (63 & e[t++])),
              s > 8191 &&
                ((o || (o = [])).push(String.fromCharCode.apply(String, i)),
                (s = 0));
          return o
            ? (s && o.push(String.fromCharCode.apply(String, i.slice(0, s))),
              o.join(""))
            : String.fromCharCode.apply(String, i.slice(0, s));
        }),
        (r.write = function (e, t, n) {
          for (var r, o, i = n, s = 0; s < e.length; ++s)
            (r = e.charCodeAt(s)) < 128
              ? (t[n++] = r)
              : r < 2048
              ? ((t[n++] = (r >> 6) | 192), (t[n++] = (63 & r) | 128))
              : 55296 == (64512 & r) &&
                56320 == (64512 & (o = e.charCodeAt(s + 1)))
              ? ((r = 65536 + ((1023 & r) << 10) + (1023 & o)),
                ++s,
                (t[n++] = (r >> 18) | 240),
                (t[n++] = ((r >> 12) & 63) | 128),
                (t[n++] = ((r >> 6) & 63) | 128),
                (t[n++] = (63 & r) | 128))
              : ((t[n++] = (r >> 12) | 224),
                (t[n++] = ((r >> 6) & 63) | 128),
                (t[n++] = (63 & r) | 128));
          return n - i;
        });
    },
    function (e, t, n) {
      e.exports = l;
      var r = n(9);
      ((l.prototype = Object.create(r.prototype)).constructor = l).className =
        "Root";
      var o,
        i,
        s,
        a = n(5),
        u = n(4),
        c = n(10),
        d = n(1);
      function l(e) {
        r.call(this, "", e),
          (this.deferred = []),
          (this.files = []),
          (this.names = []);
      }
      function p() {}
      (l.fromJSON = function (e, t) {
        return (
          (e = "string" == typeof e ? JSON.parse(e) : e),
          t || (t = new l()),
          e.options && t.setOptions(e.options),
          t.addJSON(e.nested)
        );
      }),
        (l.prototype.resolvePath = d.path.resolve),
        (l.prototype.parseFromPbString = function e(t, n, r) {
          "function" == typeof n && ((r = n), (n = void 0));
          var o = this;
          if (!r) return d.asPromise(e, o, t, n);
          var a = null;
          if ("string" == typeof t) a = JSON.parse(t);
          else {
            if ("object" != typeof t) return void console.log("pb格式转化失败");
            a = t;
          }
          function u(e, t) {
            if (r) {
              var n = r;
              (r = null), n(e, t);
            }
          }
          function c(e, t) {
            try {
              if (
                (d.isString(t) && "{" === t.charAt(0) && (t = JSON.parse(t)),
                d.isString(t))
              ) {
                i.filename = e;
                var r,
                  s = i(t, o, n),
                  a = 0;
                if (s.imports)
                  for (; a < s.imports.length; ++a) l((r = s.imports[a]));
                if (s.weakImports) {
                  for (a = 0; a < s.weakImports.length; ++a)
                    r = s.weakImports[a];
                  l(r);
                }
              } else o.setOptions(t.options).addJSON(t.nested);
            } catch (e) {
              u(e);
            }
            u(null, o);
          }
          function l(e) {
            o.names.indexOf(e) > -1 || (o.names.push(e), e in s && c(e, s[e]));
          }
          c(a.name, a.pbJsonStr);
        }),
        (l.prototype.load = function e(t, n, r) {
          "function" == typeof n && ((r = n), (n = void 0));
          var o = this;
          if (!r) return d.asPromise(e, o, t, n);
          var a = r === p;
          function u(e, t) {
            if (r) {
              var n = r;
              if (((r = null), a)) throw e;
              n(e, t);
            }
          }
          function c(e, t) {
            try {
              if (
                (d.isString(t) && "{" === t.charAt(0) && (t = JSON.parse(t)),
                d.isString(t))
              ) {
                i.filename = e;
                var r,
                  s = i(t, o, n),
                  c = 0;
                if (s.imports)
                  for (; c < s.imports.length; ++c)
                    (r = o.resolvePath(e, s.imports[c])) && l(r);
                if (s.weakImports)
                  for (c = 0; c < s.weakImports.length; ++c)
                    (r = o.resolvePath(e, s.weakImports[c])) && l(r, !0);
              } else o.setOptions(t.options).addJSON(t.nested);
            } catch (e) {
              u(e);
            }
            a || f || u(null, o);
          }
          function l(e, t) {
            var n = e.lastIndexOf("google/protobuf/");
            if (n > -1) {
              var i = e.substring(n);
              i in s && (e = i);
            }
            if (!(o.files.indexOf(e) > -1))
              if ((o.files.push(e), e in s))
                a
                  ? c(e, s[e])
                  : (++f,
                    setTimeout(function () {
                      --f, c(e, s[e]);
                    }));
              else if (a) {
                var l;
                try {
                  l = d.fs.readFileSync(e).toString("utf8");
                } catch (e) {
                  return void (t || u(e));
                }
                c(e, l);
              } else
                ++f,
                  d.fetch(e, function (n, i) {
                    --f, r && (n ? (t ? f || u(null, o) : u(n)) : c(e, i));
                  });
          }
          var f = 0;
          d.isString(t) && (t = [t]);
          for (var h, g = 0; g < t.length; ++g)
            (h = o.resolvePath("", t[g])) && l(h);
          if (a) return o;
          f || u(null, o);
        }),
        (l.prototype.loadSync = function (e, t) {
          if (!d.isNode) throw Error("not supported");
          return this.load(e, t, p);
        }),
        (l.prototype.resolveAll = function () {
          if (this.deferred.length)
            throw Error(
              "unresolvable extensions: " +
                this.deferred
                  .map(function (e) {
                    return "'extend " + e.extend + "' in " + e.parent.fullName;
                  })
                  .join(", ")
            );
          return r.prototype.resolveAll.call(this);
        });
      var f = /^[A-Z]/;
      function h(e, t) {
        var n = t.parent.lookup(t.extend);
        if (n) {
          var r = new a(t.fullName, t.id, t.type, t.rule, void 0, t.options);
          return (r.declaringField = t), (t.extensionField = r), n.add(r), !0;
        }
        return !1;
      }
      (l.prototype._handleAdd = function (e) {
        if (e instanceof a)
          void 0 === e.extend ||
            e.extensionField ||
            h(0, e) ||
            this.deferred.push(e);
        else if (e instanceof u)
          f.test(e.name) && (e.parent[e.name] = e.values);
        else if (!(e instanceof c)) {
          if (e instanceof o)
            for (var t = 0; t < this.deferred.length; )
              h(0, this.deferred[t]) ? this.deferred.splice(t, 1) : ++t;
          for (var n = 0; n < e.nestedArray.length; ++n)
            this._handleAdd(e._nestedArray[n]);
          f.test(e.name) && (e.parent[e.name] = e);
        }
      }),
        (l.prototype._handleRemove = function (e) {
          if (e instanceof a) {
            if (void 0 !== e.extend)
              if (e.extensionField)
                e.extensionField.parent.remove(e.extensionField),
                  (e.extensionField = null);
              else {
                var t = this.deferred.indexOf(e);
                t > -1 && this.deferred.splice(t, 1);
              }
          } else if (e instanceof u) f.test(e.name) && delete e.parent[e.name];
          else if (e instanceof r) {
            for (var n = 0; n < e.nestedArray.length; ++n)
              this._handleRemove(e._nestedArray[n]);
            f.test(e.name) && delete e.parent[e.name];
          }
        }),
        (l._configure = function () {
          (o = n(6)),
            (i = n(22)),
            (s = n(25)),
            (a = n(5)),
            (u = n(4)),
            (c = n(10)),
            (d = n(1));
        });
    },
    function (e, t, n) {
      "use strict";
      e.exports = a;
      var r,
        o,
        i,
        s = n(9);
      function a(e, t) {
        s.call(this, e, t), (this.methods = {}), (this._methodsArray = null);
      }
      function u(e) {
        return (e._methodsArray = null), e;
      }
      (((a.prototype = Object.create(s.prototype)).constructor = a).className =
        "Service"),
        (a.fromJSON = function (e, t) {
          var n = new a(e, t.options);
          if (t.methods)
            for (var o = Object.keys(t.methods), i = 0; i < o.length; ++i)
              n.add(r.fromJSON(o[i], t.methods[o[i]]));
          return t.nested && n.addJSON(t.nested), (n.comment = t.comment), n;
        }),
        (a.prototype.toJSON = function (e) {
          var t = s.prototype.toJSON.call(this, e),
            n = !!e && Boolean(e.keepComments);
          return o.toObject([
            "options",
            (t && t.options) || void 0,
            "methods",
            s.arrayToJSON(this.methodsArray, e) || {},
            "nested",
            (t && t.nested) || void 0,
            "comment",
            n ? this.comment : void 0,
          ]);
        }),
        Object.defineProperty(a.prototype, "methodsArray", {
          get: function () {
            return (
              this._methodsArray ||
              (this._methodsArray = o.toArray(this.methods))
            );
          },
        }),
        (a.prototype.get = function (e) {
          return this.methods[e] || s.prototype.get.call(this, e);
        }),
        (a.prototype.resolveAll = function () {
          for (var e = this.methodsArray, t = 0; t < e.length; ++t)
            e[t].resolve();
          return s.prototype.resolve.call(this);
        }),
        (a.prototype.add = function (e) {
          if (this.get(e.name))
            throw Error("duplicate name '" + e.name + "' in " + this);
          return e instanceof r
            ? ((this.methods[e.name] = e), (e.parent = this), u(this))
            : s.prototype.add.call(this, e);
        }),
        (a.prototype.remove = function (e) {
          if (e instanceof r) {
            if (this.methods[e.name] !== e)
              throw Error(e + " is not a member of " + this);
            return delete this.methods[e.name], (e.parent = null), u(this);
          }
          return s.prototype.remove.call(this, e);
        }),
        (a.prototype.create = function (e, t, n) {
          for (
            var r, s = new i.Service(e, t, n), a = 0;
            a < this.methodsArray.length;
            ++a
          ) {
            var u = o
              .lcFirst((r = this._methodsArray[a]).resolve().name)
              .replace(/[^$\w_]/g, "");
            s[u] = o.codegen(
              ["r", "c"],
              o.isReserved(u) ? u + "_" : u
            )("return this.rpcCall(m,q,s,r,c)")({
              m: r,
              q: r.resolvedRequestType.ctor,
              s: r.resolvedResponseType.ctor,
            });
          }
          return s;
        }),
        (a._configure = function () {
          (r = n(17)), (o = n(1)), (i = n(24));
        });
    },
    function (e, t, n) {
      "use strict";
      const r = n(38),
        o = n(39),
        i = n(40),
        s = n(41);
      function a(e) {
        if ("string" != typeof e || 1 !== e.length)
          throw new TypeError(
            "arrayFormatSeparator must be single character string"
          );
      }
      function u(e, t) {
        return t.encode ? (t.strict ? r(e) : encodeURIComponent(e)) : e;
      }
      function c(e, t) {
        return t.decode ? o(e) : e;
      }
      function d(e) {
        const t = e.indexOf("#");
        return -1 !== t && (e = e.slice(0, t)), e;
      }
      function l(e) {
        const t = (e = d(e)).indexOf("?");
        return -1 === t ? "" : e.slice(t + 1);
      }
      function p(e, t) {
        return (
          t.parseNumbers &&
          !Number.isNaN(Number(e)) &&
          "string" == typeof e &&
          "" !== e.trim()
            ? (e = Number(e))
            : !t.parseBooleans ||
              null === e ||
              ("true" !== e.toLowerCase() && "false" !== e.toLowerCase()) ||
              (e = "true" === e.toLowerCase()),
          e
        );
      }
      function f(e, t) {
        a(
          (t = Object.assign(
            {
              decode: !0,
              sort: !0,
              arrayFormat: "none",
              arrayFormatSeparator: ",",
              parseNumbers: !1,
              parseBooleans: !1,
            },
            t
          )).arrayFormatSeparator
        );
        const n = (function (e) {
            let t;
            switch (e.arrayFormat) {
              case "index":
                return (e, n, r) => {
                  (t = /\[(\d*)\]$/.exec(e)),
                    (e = e.replace(/\[\d*\]$/, "")),
                    t
                      ? (void 0 === r[e] && (r[e] = {}), (r[e][t[1]] = n))
                      : (r[e] = n);
                };
              case "bracket":
                return (e, n, r) => {
                  (t = /(\[\])$/.exec(e)),
                    (e = e.replace(/\[\]$/, "")),
                    t
                      ? void 0 !== r[e]
                        ? (r[e] = [].concat(r[e], n))
                        : (r[e] = [n])
                      : (r[e] = n);
                };
              case "comma":
              case "separator":
                return (t, n, r) => {
                  const o =
                      "string" == typeof n &&
                      n.includes(e.arrayFormatSeparator),
                    i =
                      "string" == typeof n &&
                      !o &&
                      c(n, e).includes(e.arrayFormatSeparator);
                  n = i ? c(n, e) : n;
                  const s =
                    o || i
                      ? n.split(e.arrayFormatSeparator).map((t) => c(t, e))
                      : null === n
                      ? n
                      : c(n, e);
                  r[t] = s;
                };
              default:
                return (e, t, n) => {
                  void 0 !== n[e] ? (n[e] = [].concat(n[e], t)) : (n[e] = t);
                };
            }
          })(t),
          r = Object.create(null);
        if ("string" != typeof e) return r;
        if (!(e = e.trim().replace(/^[?#&]/, ""))) return r;
        for (const o of e.split("&")) {
          if ("" === o) continue;
          let [e, s] = i(t.decode ? o.replace(/\+/g, " ") : o, "=");
          (s =
            void 0 === s
              ? null
              : ["comma", "separator"].includes(t.arrayFormat)
              ? s
              : c(s, t)),
            n(c(e, t), s, r);
        }
        for (const e of Object.keys(r)) {
          const n = r[e];
          if ("object" == typeof n && null !== n)
            for (const e of Object.keys(n)) n[e] = p(n[e], t);
          else r[e] = p(n, t);
        }
        return !1 === t.sort
          ? r
          : (!0 === t.sort
              ? Object.keys(r).sort()
              : Object.keys(r).sort(t.sort)
            ).reduce((e, t) => {
              const n = r[t];
              return (
                Boolean(n) && "object" == typeof n && !Array.isArray(n)
                  ? (e[t] = (function e(t) {
                      return Array.isArray(t)
                        ? t.sort()
                        : "object" == typeof t
                        ? e(Object.keys(t))
                            .sort((e, t) => Number(e) - Number(t))
                            .map((e) => t[e])
                        : t;
                    })(n))
                  : (e[t] = n),
                e
              );
            }, Object.create(null));
      }
      (t.extract = l),
        (t.parse = f),
        (t.stringify = (e, t) => {
          if (!e) return "";
          a(
            (t = Object.assign(
              {
                encode: !0,
                strict: !0,
                arrayFormat: "none",
                arrayFormatSeparator: ",",
              },
              t
            )).arrayFormatSeparator
          );
          const n = (n) =>
              (t.skipNull && null == e[n]) ||
              (t.skipEmptyString && "" === e[n]),
            r = (function (e) {
              switch (e.arrayFormat) {
                case "index":
                  return (t) => (n, r) => {
                    const o = n.length;
                    return void 0 === r ||
                      (e.skipNull && null === r) ||
                      (e.skipEmptyString && "" === r)
                      ? n
                      : null === r
                      ? [...n, [u(t, e), "[", o, "]"].join("")]
                      : [...n, [u(t, e), "[", u(o, e), "]=", u(r, e)].join("")];
                  };
                case "bracket":
                  return (t) => (n, r) =>
                    void 0 === r ||
                    (e.skipNull && null === r) ||
                    (e.skipEmptyString && "" === r)
                      ? n
                      : null === r
                      ? [...n, [u(t, e), "[]"].join("")]
                      : [...n, [u(t, e), "[]=", u(r, e)].join("")];
                case "comma":
                case "separator":
                  return (t) => (n, r) =>
                    null == r || 0 === r.length
                      ? n
                      : 0 === n.length
                      ? [[u(t, e), "=", u(r, e)].join("")]
                      : [[n, u(r, e)].join(e.arrayFormatSeparator)];
                default:
                  return (t) => (n, r) =>
                    void 0 === r ||
                    (e.skipNull && null === r) ||
                    (e.skipEmptyString && "" === r)
                      ? n
                      : null === r
                      ? [...n, u(t, e)]
                      : [...n, [u(t, e), "=", u(r, e)].join("")];
              }
            })(t),
            o = {};
          for (const t of Object.keys(e)) n(t) || (o[t] = e[t]);
          const i = Object.keys(o);
          return (
            !1 !== t.sort && i.sort(t.sort),
            i
              .map((n) => {
                const o = e[n];
                return void 0 === o
                  ? ""
                  : null === o
                  ? u(n, t)
                  : Array.isArray(o)
                  ? o.reduce(r(n), []).join("&")
                  : u(n, t) + "=" + u(o, t);
              })
              .filter((e) => e.length > 0)
              .join("&")
          );
        }),
        (t.parseUrl = (e, t) => {
          t = Object.assign({ decode: !0 }, t);
          const [n, r] = i(e, "#");
          return Object.assign(
            { url: n.split("?")[0] || "", query: f(l(e), t) },
            t && t.parseFragmentIdentifier && r
              ? { fragmentIdentifier: c(r, t) }
              : {}
          );
        }),
        (t.stringifyUrl = (e, n) => {
          n = Object.assign({ encode: !0, strict: !0 }, n);
          const r = d(e.url).split("?")[0] || "",
            o = t.extract(e.url),
            i = t.parse(o, { sort: !1 }),
            s = Object.assign(i, e.query);
          let a = t.stringify(s, n);
          a && (a = "?" + a);
          let c = (function (e) {
            let t = "";
            const n = e.indexOf("#");
            return -1 !== n && (t = e.slice(n)), t;
          })(e.url);
          return (
            e.fragmentIdentifier && (c = "#" + u(e.fragmentIdentifier, n)),
            `${r}${a}${c}`
          );
        }),
        (t.pick = (e, n, r) => {
          r = Object.assign({ parseFragmentIdentifier: !0 }, r);
          const { url: o, query: i, fragmentIdentifier: a } = t.parseUrl(e, r);
          return t.stringifyUrl(
            { url: o, query: s(i, n), fragmentIdentifier: a },
            r
          );
        }),
        (t.exclude = (e, n, r) => {
          const o = Array.isArray(n)
            ? (e) => !n.includes(e)
            : (e, t) => !n(e, t);
          return t.pick(e, o, r);
        });
    },
    function (e, t) {
      function n(e, t) {
        (this.lo = e >>> 0), (this.hi = t >>> 0);
      }
      e.exports = n;
      var r = (n.zero = new n(0, 0));
      (r.toNumber = function () {
        return 0;
      }),
        (r.zzEncode = r.zzDecode =
          function () {
            return this;
          }),
        (r.length = function () {
          return 1;
        });
      var o = (n.zeroHash = "\0\0\0\0\0\0\0\0");
      (n.fromNumber = function (e) {
        if (0 === e) return r;
        var t = e < 0;
        t && (e = -e);
        var o = e >>> 0,
          i = ((e - o) / 4294967296) >>> 0;
        return (
          t &&
            ((i = ~i >>> 0),
            (o = ~o >>> 0),
            ++o > 4294967295 && ((o = 0), ++i > 4294967295 && (i = 0))),
          new n(o, i)
        );
      }),
        (n.from = function (e) {
          return "number" == typeof e
            ? n.fromNumber(e)
            : "string" == typeof e || e instanceof String
            ? n.fromNumber(parseInt(e, 10))
            : e.low || e.high
            ? new n(e.low >>> 0, e.high >>> 0)
            : r;
        }),
        (n.prototype.toNumber = function (e) {
          if (!e && this.hi >>> 31) {
            var t = (1 + ~this.lo) >>> 0,
              n = ~this.hi >>> 0;
            return t || (n = (n + 1) >>> 0), -(t + 4294967296 * n);
          }
          return this.lo + 4294967296 * this.hi;
        }),
        (n.prototype.toLong = function (e) {
          return { low: 0 | this.lo, high: 0 | this.hi, unsigned: Boolean(e) };
        });
      var i = String.prototype.charCodeAt;
      (n.fromHash = function (e) {
        return e === o
          ? r
          : new n(
              (i.call(e, 0) |
                (i.call(e, 1) << 8) |
                (i.call(e, 2) << 16) |
                (i.call(e, 3) << 24)) >>>
                0,
              (i.call(e, 4) |
                (i.call(e, 5) << 8) |
                (i.call(e, 6) << 16) |
                (i.call(e, 7) << 24)) >>>
                0
            );
      }),
        (n.prototype.toHash = function () {
          return String.fromCharCode(
            255 & this.lo,
            (this.lo >>> 8) & 255,
            (this.lo >>> 16) & 255,
            this.lo >>> 24,
            255 & this.hi,
            (this.hi >>> 8) & 255,
            (this.hi >>> 16) & 255,
            this.hi >>> 24
          );
        }),
        (n.prototype.zzEncode = function () {
          var e = this.hi >> 31;
          return (
            (this.hi = (((this.hi << 1) | (this.lo >>> 31)) ^ e) >>> 0),
            (this.lo = ((this.lo << 1) ^ e) >>> 0),
            this
          );
        }),
        (n.prototype.zzDecode = function () {
          var e = -(1 & this.lo);
          return (
            (this.lo = (((this.lo >>> 1) | (this.hi << 31)) ^ e) >>> 0),
            (this.hi = ((this.hi >>> 1) ^ e) >>> 0),
            this
          );
        }),
        (n.prototype.length = function () {
          var e = this.lo,
            t = ((this.lo >>> 28) | (this.hi << 4)) >>> 0,
            n = this.hi >>> 24;
          return 0 === n
            ? 0 === t
              ? e < 16384
                ? e < 128
                  ? 1
                  : 2
                : e < 2097152
                ? 3
                : 4
              : t < 16384
              ? t < 128
                ? 5
                : 6
              : t < 2097152
              ? 7
              : 8
            : n < 128
            ? 9
            : 10;
        });
    },
    function (e, t, n) {
      e.exports = s;
      var r,
        o,
        i = n(5);
      function s(e, t, n, r, s, a) {
        if ((i.call(this, e, t, r, void 0, void 0, s, a), !o.isString(n)))
          throw TypeError("keyType must be a string");
        (this.keyType = n), (this.resolvedKeyType = null), (this.map = !0);
      }
      (((s.prototype = Object.create(i.prototype)).constructor = s).className =
        "MapField"),
        (s.fromJSON = function (e, t) {
          return new s(e, t.id, t.keyType, t.type, t.options, t.comment);
        }),
        (s.prototype.toJSON = function (e) {
          var t = !!e && Boolean(e.keepComments);
          return o.toObject([
            "keyType",
            this.keyType,
            "type",
            this.type,
            "id",
            this.id,
            "extend",
            this.extend,
            "options",
            this.options,
            "comment",
            t ? this.comment : void 0,
          ]);
        }),
        (s.prototype.resolve = function () {
          if (this.resolved) return this;
          if (void 0 === r.mapKey[this.keyType])
            throw Error("invalid key type: " + this.keyType);
          return i.prototype.resolve.call(this);
        }),
        (s.d = function (e, t, n) {
          return (
            "function" == typeof n
              ? (n = o.decorateType(n).name)
              : n && "object" == typeof n && (n = o.decorateEnum(n).name),
            function (r, i) {
              o.decorateType(r.constructor).add(new s(i, e, t, n));
            }
          );
        }),
        (s._configure = function () {
          (r = n(8)), (o = n(1));
        });
    },
    function (e, t, n) {
      "use strict";
      e.exports = i;
      var r,
        o = n(7);
      function i(e, t, n, i, s, a, u, c) {
        if (
          (r.isObject(s)
            ? ((u = s), (s = a = void 0))
            : r.isObject(a) && ((u = a), (a = void 0)),
          void 0 !== t && !r.isString(t))
        )
          throw TypeError("type must be a string");
        if (!r.isString(n)) throw TypeError("requestType must be a string");
        if (!r.isString(i)) throw TypeError("responseType must be a string");
        o.call(this, e, u),
          (this.type = t || "rpc"),
          (this.requestType = n),
          (this.requestStream = !!s || void 0),
          (this.responseType = i),
          (this.responseStream = !!a || void 0),
          (this.resolvedRequestType = null),
          (this.resolvedResponseType = null),
          (this.comment = c);
      }
      (((i.prototype = Object.create(o.prototype)).constructor = i).className =
        "Method"),
        (i.fromJSON = function (e, t) {
          return new i(
            e,
            t.type,
            t.requestType,
            t.responseType,
            t.requestStream,
            t.responseStream,
            t.options,
            t.comment
          );
        }),
        (i.prototype.toJSON = function (e) {
          var t = !!e && Boolean(e.keepComments);
          return r.toObject([
            "type",
            ("rpc" !== this.type && this.type) || void 0,
            "requestType",
            this.requestType,
            "requestStream",
            this.requestStream,
            "responseType",
            this.responseType,
            "responseStream",
            this.responseStream,
            "options",
            this.options,
            "comment",
            t ? this.comment : void 0,
          ]);
        }),
        (i.prototype.resolve = function () {
          return this.resolved
            ? this
            : ((this.resolvedRequestType = this.parent.lookupType(
                this.requestType
              )),
              (this.resolvedResponseType = this.parent.lookupType(
                this.responseType
              )),
              o.prototype.resolve.call(this));
        }),
        (i._configure = function () {
          r = n(1);
        });
    },
    function (e, t, n) {
      "use strict";
      var r;
      function o(e) {
        if (e)
          for (var t = Object.keys(e), n = 0; n < t.length; ++n)
            this[t[n]] = e[t[n]];
      }
      (e.exports = o),
        (o.create = function (e) {
          return this.$type.create(e);
        }),
        (o.encode = function (e, t) {
          return arguments.length
            ? 1 == arguments.length
              ? this.$type.encode(arguments[0])
              : this.$type.encode(arguments[0], arguments[1])
            : this.$type.encode(this);
        }),
        (o.encodeDelimited = function (e, t) {
          return this.$type.encodeDelimited(e, t);
        }),
        (o.decode = function (e) {
          return this.$type.decode(e);
        }),
        (o.decodeDelimited = function (e) {
          return this.$type.decodeDelimited(e);
        }),
        (o.verify = function (e) {
          return this.$type.verify(e);
        }),
        (o.fromObject = function (e) {
          return this.$type.fromObject(e);
        }),
        (o.toObject = function (e, t) {
          return (e = e || this), this.$type.toObject(e, t);
        }),
        (o.prototype.toJSON = function () {
          return this.$type.toObject(this, r.toJSONOptions);
        }),
        (o.set = function (e, t) {
          o[e] = t;
        }),
        (o.get = function (e) {
          return o[e];
        }),
        (o._configure = function () {
          r = n(1);
        });
    },
    function (e, t, n) {
      e.exports = c;
      var r,
        o = n(1),
        i = n(11);
      function s(e, t, n) {
        (this.fn = e), (this.len = t), (this.next = void 0), (this.val = n);
      }
      function a() {}
      function u(e) {
        (this.head = e.head),
          (this.tail = e.tail),
          (this.len = e.len),
          (this.next = e.states);
      }
      function c() {
        (this.len = 0),
          (this.head = new s(a, 0, 0)),
          (this.tail = this.head),
          (this.states = null);
      }
      function d(e, t, n) {
        t[n] = 255 & e;
      }
      function l(e, t) {
        (this.len = e), (this.next = void 0), (this.val = t);
      }
      function p(e, t, n) {
        for (; e.hi; )
          (t[n++] = (127 & e.lo) | 128),
            (e.lo = ((e.lo >>> 7) | (e.hi << 25)) >>> 0),
            (e.hi >>>= 7);
        for (; e.lo > 127; ) (t[n++] = (127 & e.lo) | 128), (e.lo = e.lo >>> 7);
        t[n++] = e.lo;
      }
      function f(e, t, n) {
        (t[n] = 255 & e),
          (t[n + 1] = (e >>> 8) & 255),
          (t[n + 2] = (e >>> 16) & 255),
          (t[n + 3] = e >>> 24);
      }
      (c.create = o.Buffer
        ? function () {
            return (c.create = function () {
              return new (void 0)();
            })();
          }
        : function () {
            return new c();
          }),
        (c.alloc = function (e) {
          return new o.Array(e);
        }),
        o.Array !== Array &&
          (c.alloc = o.pool(c.alloc, o.Array.prototype.subarray)),
        (c.prototype._push = function (e, t, n) {
          return (
            (this.tail = this.tail.next = new s(e, t, n)), (this.len += t), this
          );
        }),
        (l.prototype = Object.create(s.prototype)),
        (l.prototype.fn = function (e, t, n) {
          for (; e > 127; ) (t[n++] = (127 & e) | 128), (e >>>= 7);
          t[n] = e;
        }),
        (c.prototype.uint32 = function (e) {
          return (
            (this.len += (this.tail = this.tail.next =
              new l(
                (e >>>= 0) < 128
                  ? 1
                  : e < 16384
                  ? 2
                  : e < 2097152
                  ? 3
                  : e < 268435456
                  ? 4
                  : 5,
                e
              )).len),
            this
          );
        }),
        (c.prototype.int32 = function (e) {
          return e < 0 ? this._push(p, 10, r.fromNumber(e)) : this.uint32(e);
        }),
        (c.prototype.sint32 = function (e) {
          return this.uint32(((e << 1) ^ (e >> 31)) >>> 0);
        }),
        (c.prototype.uint64 = function (e) {
          var t = r.from(e);
          return this._push(p, t.length(), t);
        }),
        (c.prototype.int64 = c.prototype.uint64),
        (c.prototype.sint64 = function (e) {
          var t = r.from(e).zzEncode();
          return this._push(p, t.length(), t);
        }),
        (c.prototype.bool = function (e) {
          return this._push(d, 1, e ? 1 : 0);
        }),
        (c.prototype.fixed32 = function (e) {
          return this._push(f, 4, e >>> 0);
        }),
        (c.prototype.sfixed32 = c.prototype.fixed32),
        (c.prototype.fixed64 = function (e) {
          var t = r.from(e);
          return this._push(f, 4, t.lo)._push(f, 4, t.hi);
        }),
        (c.prototype.sfixed64 = c.prototype.fixed64),
        (c.prototype.float = function (e) {
          return this._push(o.float.writeFloatLE, 4, e);
        }),
        (c.prototype.double = function (e) {
          return this._push(o.float.writeDoubleLE, 8, e);
        });
      var h = o.Array.prototype.set
        ? function (e, t, n) {
            t.set(e, n);
          }
        : function (e, t, n) {
            for (var r = 0; r < e.length; ++r) t[n + r] = e[r];
          };
      (c.prototype.bytes = function (e) {
        var t = e.length >>> 0;
        if (!t) return this._push(d, 1, 0);
        if (o.isString(e)) {
          var n = c.alloc((t = i.length(e)));
          i.write(e, n, 0), (e = n);
        }
        return this.uint32(t)._push(h, t, e);
      }),
        (c.prototype.string = function (e) {
          var t = i.length(e);
          return t ? this.uint32(t)._push(i.write, t, e) : this._push(d, 1, 0);
        }),
        (c.prototype.fork = function () {
          return (
            (this.states = new u(this)),
            (this.head = this.tail = new s(a, 0, 0)),
            (this.len = 0),
            this
          );
        }),
        (c.prototype.reset = function () {
          return (
            this.states
              ? ((this.head = this.states.head),
                (this.tail = this.states.tail),
                (this.len = this.states.len),
                (this.states = this.states.next))
              : ((this.head = this.tail = new s(a, 0, 0)), (this.len = 0)),
            this
          );
        }),
        (c.prototype.ldelim = function () {
          var e = this.head,
            t = this.tail,
            n = this.len;
          return (
            this.reset().uint32(n),
            n && ((this.tail.next = e.next), (this.tail = t), (this.len += n)),
            this
          );
        }),
        (c.prototype.finish = function () {
          for (
            var e = this.head.next, t = this.constructor.alloc(this.len), n = 0;
            e;

          )
            e.fn(e.val, t, n), (n += e.len), (e = e.next);
          return t;
        }),
        (c._configure = function () {
          (r = n(15)), n(21), (i = n(11));
        });
    },
    function (e, t) {
      e.exports = {};
    },
    function (e, t, n) {
      "use strict";
      var r = e.exports;
      r.length = function (e) {
        var t = e.length;
        if (!t) return 0;
        for (var n = 0; --t % 4 > 1 && "=" === e.charAt(t); ) ++n;
        return Math.ceil(3 * e.length) / 4 - n;
      };
      for (var o = new Array(64), i = new Array(123), s = 0; s < 64; )
        i[
          (o[s] =
            s < 26 ? s + 65 : s < 52 ? s + 71 : s < 62 ? s - 4 : (s - 59) | 43)
        ] = s++;
      r.encode = function (e, t, n) {
        for (var r, i = null, s = [], a = 0, u = 0; t < n; ) {
          var c = e[t++];
          switch (u) {
            case 0:
              (s[a++] = o[c >> 2]), (r = (3 & c) << 4), (u = 1);
              break;
            case 1:
              (s[a++] = o[r | (c >> 4)]), (r = (15 & c) << 2), (u = 2);
              break;
            case 2:
              (s[a++] = o[r | (c >> 6)]), (s[a++] = o[63 & c]), (u = 0);
          }
          a > 8191 &&
            ((i || (i = [])).push(String.fromCharCode.apply(String, s)),
            (a = 0));
        }
        return (
          u && ((s[a++] = o[r]), (s[a++] = 61), 1 === u && (s[a++] = 61)),
          i
            ? (a && i.push(String.fromCharCode.apply(String, s.slice(0, a))),
              i.join(""))
            : String.fromCharCode.apply(String, s.slice(0, a))
        );
      };
      (r.decode = function (e, t, n) {
        for (var r, o = n, s = 0, a = 0; a < e.length; ) {
          var u = e.charCodeAt(a++);
          if (61 === u && s > 1) break;
          if (void 0 === (u = i[u])) throw Error("invalid encoding");
          switch (s) {
            case 0:
              (r = u), (s = 1);
              break;
            case 1:
              (t[n++] = (r << 2) | ((48 & u) >> 4)), (r = u), (s = 2);
              break;
            case 2:
              (t[n++] = ((15 & r) << 4) | ((60 & u) >> 2)), (r = u), (s = 3);
              break;
            case 3:
              (t[n++] = ((3 & r) << 6) | u), (s = 0);
          }
        }
        if (1 === s) throw Error("invalid encoding");
        return n - o;
      }),
        (r.test = function (e) {
          return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
            e
          );
        });
    },
    function (e, t, n) {
      "use strict";
      var r, o, i, s, a, u, c, d, l, p, f;
      (e.exports = w), (w.filename = null), (w.defaults = { keepCase: !1 });
      var h = /^[1-9][0-9]*$/,
        g = /^-?[1-9][0-9]*$/,
        y = /^0[x][0-9a-fA-F]+$/,
        m = /^-?0[x][0-9a-fA-F]+$/,
        v = /^0[0-7]+$/,
        _ = /^-?0[0-7]+$/,
        E = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
        N = /^[a-zA-Z_][a-zA-Z_0-9]*$/,
        b = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,
        A = /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/;
      function w(e, t, n) {
        t instanceof o || ((n = t), (t = new o())), n || (n = w.defaults);
        var O,
          S,
          I,
          k,
          R,
          T = r(e, n.alternateCommentMode || !1),
          D = T.next,
          M = T.push,
          C = T.peek,
          U = T.skip,
          x = T.cmnt,
          G = !0,
          L = !1,
          P = t,
          B = n.keepCase
            ? function (e) {
                return e;
              }
            : f.camelCase;
        function j(e, t, n) {
          var r = w.filename;
          return (
            n || (w.filename = null),
            Error(
              "illegal " +
                (t || "token") +
                " '" +
                e +
                "' (" +
                (r ? r + ", " : "") +
                "line " +
                T.line +
                ")"
            )
          );
        }
        function F() {
          var e,
            t = [];
          do {
            if ('"' !== (e = D()) && "'" !== e) throw j(e);
            t.push(D()), U(e), (e = C());
          } while ('"' === e || "'" === e);
          return t.join("");
        }
        function V(e) {
          var t = D();
          switch (t) {
            case "'":
            case '"':
              return M(t), F();
            case "true":
            case "TRUE":
              return !0;
            case "false":
            case "FALSE":
              return !1;
          }
          try {
            return (function (e, t) {
              var n = 1;
              "-" === e.charAt(0) && ((n = -1), (e = e.substring(1)));
              switch (e) {
                case "inf":
                case "INF":
                case "Inf":
                  return n * (1 / 0);
                case "nan":
                case "NAN":
                case "Nan":
                case "NaN":
                  return NaN;
                case "0":
                  return 0;
              }
              if (h.test(e)) return n * parseInt(e, 10);
              if (y.test(e)) return n * parseInt(e, 16);
              if (v.test(e)) return n * parseInt(e, 8);
              if (E.test(e)) return n * parseFloat(e);
              throw j(e, "number", t);
            })(t, !0);
          } catch (n) {
            if (e && b.test(t)) return t;
            throw j(t, "value");
          }
        }
        function q(e, t) {
          var n, r;
          do {
            !t || ('"' !== (n = C()) && "'" !== n)
              ? e.push([(r = J(D())), U("to", !0) ? J(D()) : r])
              : e.push(F());
          } while (U(",", !0));
          U(";");
        }
        function J(e, t) {
          switch (e) {
            case "max":
            case "MAX":
            case "Max":
              return 536870911;
            case "0":
              return 0;
          }
          if (!t && "-" === e.charAt(0)) throw j(e, "id");
          if (g.test(e)) return parseInt(e, 10);
          if (m.test(e)) return parseInt(e, 16);
          if (_.test(e)) return parseInt(e, 8);
          throw j(e, "id");
        }
        function K() {
          if (void 0 !== O) throw j("package");
          if (((O = D()), !b.test(O))) throw j(O, "name");
          (P = P.define(O)), U(";");
        }
        function Y() {
          var e,
            t = C();
          switch (t) {
            case "weak":
              (e = I || (I = [])), D();
              break;
            case "public":
              D();
            default:
              e = S || (S = []);
          }
          (t = F()), U(";"), e.push(t);
        }
        function W() {
          if ((U("="), (k = F()), !(L = "proto3" === k) && "proto2" !== k))
            throw j(k, "syntax");
          U(";");
        }
        function H(e, t) {
          switch (t) {
            case "option":
              return $(e, t), U(";"), !0;
            case "message":
              return (
                (function (e, t) {
                  if (!N.test((t = D()))) throw j(t, "type name");
                  var n = new i(t);
                  Z(n, function (e) {
                    if (!H(n, e))
                      switch (e) {
                        case "map":
                          !(function (e) {
                            U("<");
                            var t = D();
                            if (void 0 === p.mapKey[t]) throw j(t, "type");
                            U(",");
                            var n = D();
                            if (!b.test(n)) throw j(n, "type");
                            U(">");
                            var r = D();
                            if (!N.test(r)) throw j(r, "name");
                            U("=");
                            var o = new a(B(r), J(D()), t, n);
                            Z(
                              o,
                              function (e) {
                                if ("option" !== e) throw j(e);
                                $(o, e), U(";");
                              },
                              function () {
                                ee(o);
                              }
                            ),
                              e.add(o);
                          })(n);
                          break;
                        case "required":
                        case "optional":
                        case "repeated":
                          X(n, e);
                          break;
                        case "oneof":
                          !(function (e, t) {
                            if (!N.test((t = D()))) throw j(t, "name");
                            var n = new u(B(t));
                            Z(n, function (e) {
                              "option" === e
                                ? ($(n, e), U(";"))
                                : (M(e), X(n, "optional"));
                            }),
                              e.add(n);
                          })(n, e);
                          break;
                        case "extensions":
                          q(n.extensions || (n.extensions = []));
                          break;
                        case "reserved":
                          q(n.reserved || (n.reserved = []), !0);
                          break;
                        default:
                          if (!L || !b.test(e)) throw j(e);
                          M(e), X(n, "optional");
                      }
                  }),
                    e.add(n);
                })(e, t),
                !0
              );
            case "enum":
              return (
                (function (e, t) {
                  if (!N.test((t = D()))) throw j(t, "name");
                  var n = new c(t);
                  Z(n, function (e) {
                    switch (e) {
                      case "option":
                        $(n, e), U(";");
                        break;
                      case "reserved":
                        q(n.reserved || (n.reserved = []), !0);
                        break;
                      default:
                        !(function (e, t) {
                          if (!N.test(t)) throw j(t, "name");
                          U("=");
                          var n = J(D(), !0),
                            r = {};
                          Z(
                            r,
                            function (e) {
                              if ("option" !== e) throw j(e);
                              $(r, e), U(";");
                            },
                            function () {
                              ee(r);
                            }
                          ),
                            e.add(t, n, r.comment);
                        })(n, e);
                    }
                  }),
                    e.add(n);
                })(e, t),
                !0
              );
            case "service":
              return (
                (function (e, t) {
                  if (!N.test((t = D()))) throw j(t, "service name");
                  var n = new d(t);
                  Z(n, function (e) {
                    if (!H(n, e)) {
                      if ("rpc" !== e) throw j(e);
                      !(function (e, t) {
                        var n = t;
                        if (!N.test((t = D()))) throw j(t, "name");
                        var r,
                          o,
                          i,
                          s,
                          a = t;
                        U("("), U("stream", !0) && (o = !0);
                        if (!b.test((t = D()))) throw j(t);
                        (r = t),
                          U(")"),
                          U("returns"),
                          U("("),
                          U("stream", !0) && (s = !0);
                        if (!b.test((t = D()))) throw j(t);
                        (i = t), U(")");
                        var u = new l(a, n, r, i, o, s);
                        Z(u, function (e) {
                          if ("option" !== e) throw j(e);
                          $(u, e), U(";");
                        }),
                          e.add(u);
                      })(n, e);
                    }
                  }),
                    e.add(n);
                })(e, t),
                !0
              );
            case "extend":
              return (
                (function (e, t) {
                  if (!b.test((t = D()))) throw j(t, "reference");
                  var n = t;
                  Z(null, function (t) {
                    switch (t) {
                      case "required":
                      case "repeated":
                      case "optional":
                        X(e, t, n);
                        break;
                      default:
                        if (!L || !b.test(t)) throw j(t);
                        M(t), X(e, "optional", n);
                    }
                  });
                })(e, t),
                !0
              );
          }
          return !1;
        }
        function Z(e, t, n) {
          var r = T.line;
          if (
            (e && ((e.comment = x()), (e.filename = w.filename)), U("{", !0))
          ) {
            for (var o; "}" !== (o = D()); ) t(o);
            U(";", !0);
          } else
            n && n(),
              U(";"),
              e && "string" != typeof e.comment && (e.comment = x(r));
        }
        function X(e, t, n) {
          var r = D();
          if ("group" !== r) {
            if (!b.test(r)) throw j(r, "type");
            var o = D();
            if (!N.test(o)) throw j(o, "name");
            (o = B(o)), U("=");
            var a = new s(o, J(D()), r, t, n);
            Z(
              a,
              function (e) {
                if ("option" !== e) throw j(e);
                $(a, e), U(";");
              },
              function () {
                ee(a);
              }
            ),
              e.add(a),
              L ||
                !a.repeated ||
                (void 0 === p.packed[r] && void 0 !== p.basic[r]) ||
                a.setOption("packed", !1, !0);
          } else
            !(function (e, t) {
              var n = D();
              if (!N.test(n)) throw j(n, "name");
              var r = f.lcFirst(n);
              n === r && (n = f.ucFirst(n));
              U("=");
              var o = J(D()),
                a = new i(n);
              a.group = !0;
              var u = new s(r, o, n, t);
              (u.filename = w.filename),
                Z(a, function (e) {
                  switch (e) {
                    case "option":
                      $(a, e), U(";");
                      break;
                    case "required":
                    case "optional":
                    case "repeated":
                      X(a, e);
                      break;
                    default:
                      throw j(e);
                  }
                }),
                e.add(a).add(u);
            })(e, t);
        }
        function $(e, t) {
          var n = U("(", !0);
          if (!b.test((t = D()))) throw j(t, "name");
          var r = t;
          n &&
            (U(")"),
            (r = "(" + r + ")"),
            (t = C()),
            A.test(t) && ((r += t), D())),
            U("="),
            z(e, r);
        }
        function z(e, t) {
          if (U("{", !0))
            do {
              if (!N.test((R = D()))) throw j(R, "name");
              "{" === C()
                ? z(e, t + "." + R)
                : (U(":"),
                  "{" === C() ? z(e, t + "." + R) : Q(e, t + "." + R, V(!0)));
            } while (!U("}", !0));
          else Q(e, t, V(!0));
        }
        function Q(e, t, n) {
          e.setOption && e.setOption(t, n);
        }
        function ee(e) {
          if (U("[", !0)) {
            do {
              $(e, "option");
            } while (U(",", !0));
            U("]");
          }
          return e;
        }
        for (; null !== (R = D()); )
          switch (R) {
            case "package":
              if (!G) throw j(R);
              K();
              break;
            case "import":
              if (!G) throw j(R);
              Y();
              break;
            case "syntax":
              if (!G) throw j(R);
              W();
              break;
            case "option":
              if (!G) throw j(R);
              $(P, R), U(";");
              break;
            default:
              if (H(P, R)) {
                G = !1;
                continue;
              }
              throw j(R);
          }
        return (
          (w.filename = null),
          { package: O, imports: S, weakImports: I, syntax: k, root: t }
        );
      }
      w._configure = function () {
        (r = n(23)),
          (o = n(12)),
          (i = n(6)),
          (s = n(5)),
          (a = n(16)),
          (u = n(10)),
          (c = n(4)),
          (d = n(13)),
          (l = n(17)),
          (p = n(8)),
          (f = n(1));
      };
    },
    function (e, t) {
      e.exports = p;
      var n = /[\s{}=;:[\],'"()<>]/g,
        r = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
        o = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
        i = /^ *[*/]+ */,
        s = /^\s*\*?\/*/,
        a = /\n/g,
        u = /\s/,
        c = /\\(.?)/g,
        d = { 0: "\0", r: "\r", n: "\n", t: "\t" };
      function l(e) {
        return e.replace(c, function (e, t) {
          switch (t) {
            case "\\":
            case "":
              return t;
            default:
              return d[t] || "";
          }
        });
      }
      function p(e, t) {
        e = e.toString();
        var c = 0,
          d = e.length,
          p = 1,
          f = null,
          h = null,
          g = 0,
          y = !1,
          m = [],
          v = null;
        function _(e) {
          return Error("illegal " + e + " (line " + p + ")");
        }
        function E(t) {
          return e.charAt(t);
        }
        function N(n, r) {
          (f = e.charAt(n++)), (g = p), (y = !1);
          var o,
            u = n - (t ? 2 : 3);
          do {
            if (--u < 0 || "\n" === (o = e.charAt(u))) {
              y = !0;
              break;
            }
          } while (" " === o || "\t" === o);
          for (var c = e.substring(n, r).split(a), d = 0; d < c.length; ++d)
            c[d] = c[d].replace(t ? s : i, "").trim();
          h = c.join("\n").trim();
        }
        function b(t) {
          var n = A(t),
            r = e.substring(t, n);
          return /^\s*\/{1,2}/.test(r);
        }
        function A(e) {
          for (var t = e; t < d && "\n" !== E(t); ) t++;
          return t;
        }
        function w() {
          if (m.length > 0) return m.shift();
          if (v)
            return (function () {
              var t = "'" === v ? o : r;
              t.lastIndex = c - 1;
              var n = t.exec(e);
              if (!n) throw _("string");
              return (c = t.lastIndex), O(v), (v = null), l(n[1]);
            })();
          var i, s, a, f, h;
          do {
            if (c === d) return null;
            for (i = !1; u.test((a = E(c))); )
              if (("\n" === a && ++p, ++c === d)) return null;
            if ("/" === E(c)) {
              if (++c === d) throw _("comment");
              if ("/" === E(c))
                if (t) {
                  if (((f = c), (h = !1), b(c))) {
                    h = !0;
                    do {
                      if ((c = A(c)) === d) break;
                      c++;
                    } while (b(c));
                  } else c = Math.min(d, A(c) + 1);
                  h && N(f, c), p++, (i = !0);
                } else {
                  for (h = "/" === E((f = c + 1)); "\n" !== E(++c); )
                    if (c === d) return null;
                  ++c, h && N(f, c - 1), ++p, (i = !0);
                }
              else {
                if ("*" !== (a = E(c))) return "/";
                (f = c + 1), (h = t || "*" === E(f));
                do {
                  if (("\n" === a && ++p, ++c === d)) throw _("comment");
                  (s = a), (a = E(c));
                } while ("*" !== s || "/" !== a);
                ++c, h && N(f, c - 2), (i = !0);
              }
            }
          } while (i);
          var g = c;
          if (((n.lastIndex = 0), !n.test(E(g++))))
            for (; g < d && !n.test(E(g)); ) ++g;
          var y = e.substring(c, (c = g));
          return ('"' !== y && "'" !== y) || (v = y), y;
        }
        function O(e) {
          m.push(e);
        }
        function S() {
          if (!m.length) {
            var e = w();
            if (null === e) return null;
            O(e);
          }
          return m[0];
        }
        return Object.defineProperty(
          {
            next: w,
            peek: S,
            push: O,
            skip: function (e, t) {
              var n = S();
              if (n === e) return w(), !0;
              if (!t) throw _("token '" + n + "', '" + e + "' expected");
              return !1;
            },
            cmnt: function (e) {
              var n = null;
              return (
                void 0 === e
                  ? g === p - 1 && (t || "*" === f || y) && (n = h)
                  : (g < e && S(),
                    g !== e || y || (!t && "/" !== f) || (n = h)),
                n
              );
            },
          },
          "line",
          {
            get: function () {
              return p;
            },
          }
        );
      }
      p.unescape = l;
    },
    function (e, t, n) {
      "use strict";
      e.exports = o;
      var r = n(1);
      function o(e, t, n) {
        if ("function" != typeof e)
          throw TypeError("rpcImpl must be a function");
        r.EventEmitter.call(this),
          (this.rpcImpl = e),
          (this.requestDelimited = Boolean(t)),
          (this.responseDelimited = Boolean(n));
      }
      ((o.prototype = Object.create(r.EventEmitter.prototype)).constructor = o),
        (o.prototype.rpcCall = function e(t, n, o, i, s) {
          if (!i) throw TypeError("request must be specified");
          var a = this;
          if (!s) return r.asPromise(e, a, t, n, o, i);
          if (a.rpcImpl)
            try {
              return a.rpcImpl(
                t,
                n[a.requestDelimited ? "encodeDelimited" : "encode"](
                  i
                ).finish(),
                function (e, n) {
                  if (e) return a.emit("error", e, t), s(e);
                  if (null !== n) {
                    if (!(n instanceof o))
                      try {
                        n =
                          o[a.responseDelimited ? "decodeDelimited" : "decode"](
                            n
                          );
                      } catch (e) {
                        return a.emit("error", e, t), s(e);
                      }
                    return a.emit("data", n, t), s(null, n);
                  }
                  a.end(!0);
                }
              );
            } catch (e) {
              return (
                a.emit("error", e, t),
                void setTimeout(function () {
                  s(e);
                }, 0)
              );
            }
          else
            setTimeout(function () {
              s(Error("already ended"));
            }, 0);
        }),
        (o.prototype.end = function (e) {
          return (
            this.rpcImpl &&
              (e || this.rpcImpl(null, null, null),
              (this.rpcImpl = null),
              this.emit("end").off()),
            this
          );
        });
    },
    function (e, t) {
      e.exports = o;
      var n,
        r = /\/|\./;
      function o(e, t) {
        r.test(e) ||
          ((e = "google/protobuf/" + e + ".proto"),
          (t = {
            nested: { google: { nested: { protobuf: { nested: t } } } },
          })),
          (o[e] = t);
      }
      o("any", {
        Any: {
          fields: {
            type_url: { type: "string", id: 1 },
            value: { type: "bytes", id: 2 },
          },
        },
      }),
        o("duration", {
          Duration: (n = {
            fields: {
              seconds: { type: "int64", id: 1 },
              nanos: { type: "int32", id: 2 },
            },
          }),
        }),
        o("timestamp", { Timestamp: n }),
        o("empty", { Empty: { fields: {} } }),
        o("struct", {
          Struct: {
            fields: { fields: { keyType: "string", type: "Value", id: 1 } },
          },
          Value: {
            oneofs: {
              kind: {
                oneof: [
                  "nullValue",
                  "numberValue",
                  "stringValue",
                  "boolValue",
                  "structValue",
                  "listValue",
                ],
              },
            },
            fields: {
              nullValue: { type: "NullValue", id: 1 },
              numberValue: { type: "double", id: 2 },
              stringValue: { type: "string", id: 3 },
              boolValue: { type: "bool", id: 4 },
              structValue: { type: "Struct", id: 5 },
              listValue: { type: "ListValue", id: 6 },
            },
          },
          NullValue: { values: { NULL_VALUE: 0 } },
          ListValue: {
            fields: { values: { rule: "repeated", type: "Value", id: 1 } },
          },
        }),
        o("wrappers", {
          DoubleValue: { fields: { value: { type: "double", id: 1 } } },
          FloatValue: { fields: { value: { type: "float", id: 1 } } },
          Int64Value: { fields: { value: { type: "int64", id: 1 } } },
          UInt64Value: { fields: { value: { type: "uint64", id: 1 } } },
          Int32Value: { fields: { value: { type: "int32", id: 1 } } },
          UInt32Value: { fields: { value: { type: "uint32", id: 1 } } },
          BoolValue: { fields: { value: { type: "bool", id: 1 } } },
          StringValue: { fields: { value: { type: "string", id: 1 } } },
          BytesValue: { fields: { value: { type: "bytes", id: 1 } } },
        }),
        o("field_mask", {
          FieldMask: {
            fields: { paths: { rule: "repeated", type: "string", id: 1 } },
          },
        }),
        (o.get = function (e) {
          return o[e] || null;
        });
    },
    function (e, t, n) {
      e.exports = a;
      var r,
        o,
        i = n(1);
      function s(e, t) {
        return RangeError(
          "index out of range: " + e.pos + " + " + (t || 1) + " > " + e.len
        );
      }
      function a(e) {
        (this.buf = e), (this.pos = 0), (this.len = e.length);
      }
      var u,
        c =
          "undefined" != typeof Uint8Array
            ? function (e) {
                if (e instanceof Uint8Array || Array.isArray(e))
                  return new a(e);
                if (
                  "undefined" != typeof ArrayBuffer &&
                  e instanceof ArrayBuffer
                )
                  return new a(new Uint8Array(e));
                throw Error("illegal buffer");
              }
            : function (e) {
                if (Array.isArray(e)) return new a(e);
                throw Error("illegal buffer");
              };
      function d() {
        var e = new r(0, 0),
          t = 0;
        if (!(this.len - this.pos > 4)) {
          for (; t < 3; ++t) {
            if (this.pos >= this.len) throw s(this);
            if (
              ((e.lo = (e.lo | ((127 & this.buf[this.pos]) << (7 * t))) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return e;
          }
          return (
            (e.lo = (e.lo | ((127 & this.buf[this.pos++]) << (7 * t))) >>> 0), e
          );
        }
        for (; t < 4; ++t)
          if (
            ((e.lo = (e.lo | ((127 & this.buf[this.pos]) << (7 * t))) >>> 0),
            this.buf[this.pos++] < 128)
          )
            return e;
        if (
          ((e.lo = (e.lo | ((127 & this.buf[this.pos]) << 28)) >>> 0),
          (e.hi = (e.hi | ((127 & this.buf[this.pos]) >> 4)) >>> 0),
          this.buf[this.pos++] < 128)
        )
          return e;
        if (((t = 0), this.len - this.pos > 4)) {
          for (; t < 5; ++t)
            if (
              ((e.hi =
                (e.hi | ((127 & this.buf[this.pos]) << (7 * t + 3))) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return e;
        } else
          for (; t < 5; ++t) {
            if (this.pos >= this.len) throw s(this);
            if (
              ((e.hi =
                (e.hi | ((127 & this.buf[this.pos]) << (7 * t + 3))) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return e;
          }
        throw Error("invalid varint encoding");
      }
      function l(e, t) {
        return (
          (e[t - 4] | (e[t - 3] << 8) | (e[t - 2] << 16) | (e[t - 1] << 24)) >>>
          0
        );
      }
      function p() {
        if (this.pos + 8 > this.len) throw s(this, 8);
        return new r(
          l(this.buf, (this.pos += 4)),
          l(this.buf, (this.pos += 4))
        );
      }
      (a.create = i.Buffer
        ? function (e) {
            return (a.create = function (e) {
              return i.Buffer.isBuffer(e) ? new (void 0)(e) : c(e);
            })(e);
          }
        : c),
        (a.prototype._slice =
          i.Array.prototype.subarray || i.Array.prototype.slice),
        (a.prototype.uint32 =
          ((u = 4294967295),
          function () {
            if (
              ((u = (127 & this.buf[this.pos]) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return u;
            if (
              ((u = (u | ((127 & this.buf[this.pos]) << 7)) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return u;
            if (
              ((u = (u | ((127 & this.buf[this.pos]) << 14)) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return u;
            if (
              ((u = (u | ((127 & this.buf[this.pos]) << 21)) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return u;
            if (
              ((u = (u | ((15 & this.buf[this.pos]) << 28)) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return u;
            if ((this.pos += 5) > this.len)
              throw ((this.pos = this.len), s(this, 10));
            return u;
          })),
        (a.prototype.int32 = function () {
          return 0 | this.uint32();
        }),
        (a.prototype.sint32 = function () {
          var e = this.uint32();
          return ((e >>> 1) ^ -(1 & e)) | 0;
        }),
        (a.prototype.bool = function () {
          return 0 !== this.uint32();
        }),
        (a.prototype.fixed32 = function () {
          if (this.pos + 4 > this.len) throw s(this, 4);
          return l(this.buf, (this.pos += 4));
        }),
        (a.prototype.sfixed32 = function () {
          if (this.pos + 4 > this.len) throw s(this, 4);
          return 0 | l(this.buf, (this.pos += 4));
        }),
        (a.prototype.float = function () {
          if (this.pos + 4 > this.len) throw s(this, 4);
          var e = i.float.readFloatLE(this.buf, this.pos);
          return (this.pos += 4), e;
        }),
        (a.prototype.double = function () {
          if (this.pos + 8 > this.len) throw s(this, 4);
          var e = i.float.readDoubleLE(this.buf, this.pos);
          return (this.pos += 8), e;
        }),
        (a.prototype.bytes = function () {
          var e = this.uint32(),
            t = this.pos,
            n = this.pos + e;
          if (n > this.len) throw s(this, e);
          return (
            (this.pos += e),
            Array.isArray(this.buf)
              ? this.buf.slice(t, n)
              : t === n
              ? new this.buf.constructor(0)
              : this._slice.call(this.buf, t, n)
          );
        }),
        (a.prototype.string = function () {
          var e = this.bytes();
          return o.read(e, 0, e.length);
        }),
        (a.prototype.skip = function (e) {
          if ("number" == typeof e) {
            if (this.pos + e > this.len) throw s(this, e);
            this.pos += e;
          } else
            do {
              if (this.pos >= this.len) throw s(this);
            } while (128 & this.buf[this.pos++]);
          return this;
        }),
        (a.prototype.skipType = function (e) {
          switch (e) {
            case 0:
              this.skip();
              break;
            case 1:
              this.skip(8);
              break;
            case 2:
              this.skip(this.uint32());
              break;
            case 3:
              for (;;) {
                if (4 == (e = 7 & this.uint32())) break;
                this.skipType(e);
              }
              break;
            case 5:
              this.skip(4);
              break;
            default:
              throw Error("invalid wire type " + e + " at offset " + this.pos);
          }
          return this;
        }),
        (a._configure = function () {
          (r = n(15)), (o = n(11));
          var e = i.Long ? "toLong" : "toNumber";
          i.merge(a.prototype, {
            int64: function () {
              return d.call(this)[e](!1);
            },
            uint64: function () {
              return d.call(this)[e](!0);
            },
            sint64: function () {
              return d.call(this).zzDecode()[e](!1);
            },
            fixed64: function () {
              return p.call(this)[e](!0);
            },
            sfixed64: function () {
              return p.call(this)[e](!1);
            },
          });
        });
    },
    function (e, t, n) {
      var r, o;
      function i(e, t) {
        return (
          e.name +
          ": " +
          t +
          (e.repeated && "array" !== t
            ? "[]"
            : e.map && "object" !== t
            ? "{k:" + e.keyType + "}"
            : "") +
          " expected"
        );
      }
      function s(e, t, n, s) {
        var a = s.types;
        if (e.resolvedType)
          if (e.resolvedType instanceof r) {
            if (Object.keys(e.resolvedType.values).indexOf(n) < 0)
              return i(e, "enum value");
          } else {
            var u = a[t].verify(n);
            if (u) return e.name + "." + u;
          }
        else
          switch (e.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
              if (!o.isInteger(n)) return i(e, "integer");
              break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
              if (
                !(
                  o.isInteger(n) ||
                  (n && o.isInteger(n.low) && o.isInteger(n.high))
                )
              )
                return i(e, "integer|Long");
              break;
            case "float":
            case "double":
              if ("number" != typeof n) return i(e, "number");
              break;
            case "bool":
              if ("boolean" != typeof n) return i(e, "boolean");
              break;
            case "string":
              if (!o.isString(n)) return i(e, "string");
              break;
            case "bytes":
              if (!((n && "number" == typeof n.length) || o.isString(n)))
                return i(e, "buffer");
          }
      }
      function a(e, t) {
        switch (e.keyType) {
          case "int32":
          case "uint32":
          case "sint32":
          case "fixed32":
          case "sfixed32":
            if (!o.key32Re.test(t)) return i(e, "integer key");
            break;
          case "int64":
          case "uint64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            if (!o.key64Re.test(t)) return i(e, "integer|Long key");
            break;
          case "bool":
            if (!o.key2Re.test(t)) return i(e, "boolean key");
        }
      }
      function u(e) {
        return function (t) {
          return function (n) {
            var r;
            if ("object" != typeof n || null === n) return "object expected";
            var u,
              c = {};
            e.oneofsArray.length && (u = {});
            for (var d = 0; d < e.fieldsArray.length; ++d) {
              var l,
                p = e._fieldsArray[d].resolve(),
                f = n[p.name];
              if (!p.optional || (null != f && n.hasOwnProperty(p.name)))
                if (p.map) {
                  if (!o.isObject(f)) return i(p, "object");
                  var h = Object.keys(f);
                  for (l = 0; l < h.length; ++l) {
                    if ((r = a(p, h[l]))) return r;
                    if ((r = s(p, d, f[h[l]], t))) return r;
                  }
                } else if (p.repeated) {
                  if (!Array.isArray(f)) return i(p, "array");
                  for (l = 0; l < f.length; ++l)
                    if ((r = s(p, d, f[l], t))) return r;
                } else {
                  if (p.partOf) {
                    var g = p.partOf.name;
                    if (1 === c[p.partOf.name] && 1 === u[g])
                      return p.partOf.name + ": multiple values";
                    u[g] = 1;
                  }
                  if ((r = s(p, d, f, t))) return r;
                }
            }
          };
        };
      }
      (e.exports = u),
        (u._configure = function () {
          (r = n(4)), (o = n(1));
        });
    },
    function (e, t, n) {
      var r, o;
      function i(e) {
        return function (t) {
          var n = t.Writer,
            i = t.types,
            s = t.util;
          return function (t, a) {
            a = a || n.create();
            for (
              var u = e.fieldsArray.slice().sort(s.compareFieldsById), c = 0;
              c < u.length;
              c++
            ) {
              var d = u[c],
                l = e._fieldsArray.indexOf(d),
                p = d.resolvedType instanceof r ? "uint32" : d.type,
                f = o.basic[p],
                h = t[d.name];
              if (
                (d.resolvedType instanceof r &&
                  "string" == typeof h &&
                  (h = i[l].values[h]),
                d.map)
              ) {
                if (null != h && t.hasOwnProperty(d.name))
                  for (var g = Object.keys(h), y = 0; y < g.length; ++y)
                    a
                      .uint32(((d.id << 3) | 2) >>> 0)
                      .fork()
                      .uint32(8 | o.mapKey[d.keyType])
                      [d.keyType](g[y]),
                      void 0 === f
                        ? i[l]
                            .encode(h[g[y]], a.uint32(18).fork())
                            .ldelim()
                            .ldelim()
                        : a
                            .uint32(16 | f)
                            [p](h[g[y]])
                            .ldelim();
              } else if (d.repeated) {
                if (h && h.length)
                  if (d.packed && void 0 !== o.packed[p]) {
                    a.uint32(((d.id << 3) | 2) >>> 0).fork();
                    for (var m = 0; m < h.length; m++) a[p](h[m]);
                    a.ldelim();
                  } else
                    for (var v = 0; v < h.length; v++)
                      void 0 === f
                        ? d.resolvedType.group
                          ? i[l]
                              .encode(h[v], a.uint32(((d.id << 3) | 3) >>> 0))
                              .uint32(((d.id << 3) | 4) >>> 0)
                          : i[l]
                              .encode(
                                h[v],
                                a.uint32(((d.id << 3) | 2) >>> 0).fork()
                              )
                              .ldelim()
                        : a.uint32(((d.id << 3) | f) >>> 0)[p](h[v]);
              } else
                (!d.optional || (null != h && t.hasOwnProperty(d.name))) &&
                  (d.optional ||
                    (null != h && t.hasOwnProperty(d.name)) ||
                    console.warn(
                      "注意啦!!!很大概率会报错 类型:",
                      t.$type ? t.$type.name : "不晓得",
                      "没有设置对应的属性:",
                      d.name,
                      "检查是不是proto文件属性设置为了required"
                    ),
                  void 0 === f
                    ? d.resolvedType.group
                      ? i[l]
                          .encode(h, a.uint32(((d.id << 3) | 3) >>> 0))
                          .uint32(((d.id << 3) | 4) >>> 0)
                      : i[l]
                          .encode(h, a.uint32(((d.id << 3) | 2) >>> 0).fork())
                          .ldelim()
                    : a.uint32(((d.id << 3) | f) >>> 0)[p](h));
            }
            return a;
          };
        };
      }
      (e.exports = i),
        (i._configure = function () {
          (r = n(4)), (o = n(8));
        });
    },
    function (e, t, n) {
      var r, o, i;
      function s(e) {
        return "missing required '" + e.name + "'";
      }
      function a(e) {
        return function (t) {
          var n = t.Reader,
            a = t.types,
            u = t.util;
          return function (t, c) {
            t instanceof n || (t = n.create(t));
            for (
              var d, l = void 0 === c ? t.len : t.pos + c, p = new this.ctor();
              t.pos < l;

            ) {
              var f = t.uint32();
              if (e.group && 4 == (7 & f)) break;
              for (
                var h = f >>> 3, g = 0, y = !1;
                g < e.fieldsArray.length;
                ++g
              ) {
                var m = e._fieldsArray[g].resolve(),
                  v = m.name,
                  _ = m.resolvedType instanceof r ? "int32" : m.type;
                if (h == m.id) {
                  if (((y = !0), m.map))
                    t.skip().pos++,
                      p[v] === u.emptyObject && (p[v] = {}),
                      (d = t[m.keyType]()),
                      t.pos++,
                      null != o.long[m.keyType]
                        ? null == o.basic[_]
                          ? (p[v]["object" == typeof d ? u.longToHash(d) : d] =
                              a[g].decode(t, t.uint32()))
                          : (p[v]["object" == typeof d ? u.longToHash(d) : d] =
                              t[_]())
                        : null == o.basic[_]
                        ? (p[v] = a[g].decode(t, t.uint32()))
                        : (p[v] = t[_]());
                  else if (m.repeated)
                    if (
                      ((p[v] && p[v].length) || (p[v] = []),
                      null != o.packed[_] && 2 == (7 & f))
                    )
                      for (var E = t.uint32() + t.pos; t.pos < E; )
                        p[v].push(t[_]());
                    else
                      null == o.basic[_]
                        ? m.resolvedType.group
                          ? p[v].push(a[g].decode(t))
                          : p[v].push(a[g].decode(t, t.uint32()))
                        : p[v].push(t[_]());
                  else
                    null == o.basic[_]
                      ? m.resolvedType.group
                        ? (p[v] = a[g].decode(t))
                        : (p[v] = a[g].decode(t, t.uint32()))
                      : (p[v] = t[_]());
                  break;
                }
              }
              y || (console.log("t", f), t.skipType(7 & f));
            }
            for (g = 0; g < e._fieldsArray.length; ++g) {
              var N = e._fieldsArray[g];
              if (N.required && !p.hasOwnProperty(N.name))
                throw i.ProtocolError(s(N), { instance: p });
            }
            return p;
          };
        };
      }
      (e.exports = a),
        (a._configure = function () {
          (r = n(4)), (o = n(8)), (i = n(1));
        });
    },
    function (e, t, n) {
      var r,
        o = t;
      (o[".google.protobuf.Any"] = {
        fromObject: function (e) {
          if (e && e["@type"]) {
            var t = this.lookup(e["@type"]);
            if (t) {
              var n =
                "." === e["@type"].charAt(0)
                  ? e["@type"].substr(1)
                  : e["@type"];
              return this.create({
                type_url: "/" + n,
                value: t.encode(t.fromObject(e)).finish(),
              });
            }
          }
          return this.fromObject(e);
        },
        toObject: function (e, t) {
          if (t && t.json && e.type_url && e.value) {
            var n = e.type_url.substring(e.type_url.lastIndexOf("/") + 1),
              o = this.lookup(n);
            o && (e = o.decode(e.value));
          }
          if (!(e instanceof this.ctor) && e instanceof r) {
            var i = e.$type.toObject(e, t);
            return (i["@type"] = e.$type.fullName), i;
          }
          return this.toObject(e, t);
        },
      }),
        (o._configure = function () {
          r = n(18);
        });
    },
    function (e, t, n) {
      var r,
        o,
        i = e.exports;
      function s(e, t, n, i) {
        var s = i.m,
          a = i.d,
          u = i.types,
          c = i.ksi,
          d = void 0 !== c;
        if (e.resolvedType)
          if (e.resolvedType instanceof r) {
            for (
              var l = d ? a[n][c] : a[n],
                p = e.resolvedType.values,
                f = Object.keys(p),
                h = 0;
              h < f.length;
              h++
            )
              if (
                !(
                  (e.repeated && p[f[h]] === e.typeDefault) ||
                  (f[h] != l && p[f[h]] != l)
                )
              ) {
                d ? (s[n][c] = p[f[h]]) : (s[n] = p[f[h]]);
                break;
              }
          } else {
            if ("object" != typeof (d ? a[n][c] : a[n]))
              throw TypeError(e.fullName + ": object expected");
            d
              ? (s[n][c] = u[t].fromObject(a[n][c]))
              : (s[n] = u[t].fromObject(a[n]));
          }
        else {
          var g = !1;
          switch (e.type) {
            case "double":
            case "float":
              d ? (s[n][c] = Number(a[n][c])) : (s[n] = Number(a[n]));
              break;
            case "uint32":
            case "fixed32":
              d ? (s[n][c] = a[n][c] >>> 0) : (s[n] = a[n] >>> 0);
              break;
            case "int32":
            case "sint32":
            case "sfixed32":
              d ? (s[n][c] = 0 | a[n][c]) : (s[n] = 0 | a[n]);
              break;
            case "uint64":
              g = !0;
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
              o.Long
                ? d
                  ? (s[n][c] = o.Long.fromValue(a[n][c]).unsigned = g)
                  : (s[n] = o.Long.fromValue(a[n]).unsigned = g)
                : "string" == typeof (d ? a[n][c] : a[n])
                ? d
                  ? (s[n][c] = parseInt(a[n][c], 10))
                  : (s[n] = parseInt(a[n], 10))
                : "number" == typeof (d ? a[n][c] : a[n])
                ? d
                  ? (s[n][c] = a[n][c])
                  : (s[n] = a[n])
                : "object" == typeof (d ? a[n][c] : a[n]) &&
                  (d
                    ? (s[n][c] = new o.LongBits(
                        a[n][c].low >>> 0,
                        a[n][c].high >>> 0
                      ).toNumber(g))
                    : (s[n] = new o.LongBits(
                        a[n].low >>> 0,
                        a[n].high >>> 0
                      ).toNumber(g)));
              break;
            case "bytes":
              "string" == typeof (d ? a[n][c] : a[n])
                ? d
                  ? o.base64.decode(
                      a[n][c],
                      (s[n][c] = o.newBuffer(o.base64.length(a[n][c]))),
                      0
                    )
                  : o.base64.decode(
                      a[n],
                      (s[n] = o.newBuffer(o.base64.length(a[n]))),
                      0
                    )
                : (d ? a[n][c] : a[n]).length &&
                  (d ? (s[n][c] = a[n][c]) : (s[n] = a[n]));
              break;
            case "string":
              d ? (s[n][c] = String(a[n][c])) : (s[n] = String(a[n]));
              break;
            case "bool":
              d ? (s[n][c] = Boolean(a[n][c])) : (s[n] = Boolean(a[n]));
          }
        }
      }
      function a(e, t, n, i) {
        var s = i.m,
          a = i.d,
          u = i.types,
          c = i.ksi,
          d = i.o,
          l = void 0 !== c;
        if (e.resolvedType)
          e.resolvedType instanceof r
            ? l
              ? (a[n][c] = d.enums === String ? u[t].values[s[n][c]] : s[n][c])
              : (a[n] = d.enums === String ? u[t].values[s[n]] : s[n])
            : l
            ? (a[n][c] = u[t].toObject(s[n][c], d))
            : (a[n] = u[t].toObject(s[n], d));
        else {
          var p = !1;
          switch (e.type) {
            case "double":
            case "float":
              l
                ? (a[n][c] =
                    d.json && !isFinite(s[n][c]) ? String(s[n][c]) : s[n][c])
                : (a[n] = d.json && !isFinite(s[n]) ? String(s[n]) : s[n]);
              break;
            case "uint64":
              p = !0;
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
              "number" == typeof s[n][c]
                ? l
                  ? (a[n][c] = d.longs === String ? String(s[n][c]) : s[n][c])
                  : (a[n] = d.longs === String ? String(s[n]) : s[n])
                : l
                ? (a[n][c] =
                    d.longs === String
                      ? o.Long.prototype.toString.call(s[n][c])
                      : d.longs === Number
                      ? new o.LongBits(
                          s[n][c].low >>> 0,
                          s[n][c].high >>> 0
                        ).toNumber(p)
                      : s[n][c])
                : (a[n] =
                    d.longs === String
                      ? o.Long.prototype.toString.call(s[n])
                      : d.longs === Number
                      ? new o.LongBits(
                          s[n].low >>> 0,
                          s[n].high >>> 0
                        ).toNumber(p)
                      : s[n]);
              break;
            case "bytes":
              l
                ? (a[n][c] =
                    d.bytes === String
                      ? o.base64.encode(s[n][c], 0, s[n][c].length)
                      : d.bytes === Array
                      ? Array.prototype.slice.call(s[n][c])
                      : s[n][c])
                : (a[n] =
                    d.bytes === String
                      ? o.base64.encode(s[n], 0, s[n].length)
                      : d.bytes === Array
                      ? Array.prototype.slice.call(s[n])
                      : s[n]);
              break;
            default:
              l ? (a[n][c] = s[n][c]) : (a[n] = s[n]);
          }
        }
      }
      (i._configure = function () {
        (r = n(4)), (o = n(1));
      }),
        (i.fromObject = function (e) {
          var t = e.fieldsArray;
          return function (e) {
            return function (n) {
              if (n instanceof this.ctor) return n;
              if (!t.length) return new this.ctor();
              for (var i = new this.ctor(), a = 0; a < t.length; ++a) {
                var u,
                  c = t[a].resolve(),
                  d = c.name;
                if (c.map) {
                  if (n[d]) {
                    if ("object" != typeof n[d])
                      throw TypeError(c.fullName + ": object expected");
                    i[d] = {};
                  }
                  var l = Object.keys(n[d]);
                  for (u = 0; u < l.length; ++u)
                    s(c, a, d, o.merge(o.copy(e), { m: i, d: n, ksi: l[u] }));
                } else if (c.repeated) {
                  if (n[d]) {
                    if (!Array.isArray(n[d]))
                      throw TypeError(c.fullName + ": array expected");
                    for (i[d] = [], u = 0; u < n[d].length; ++u)
                      s(c, a, d, o.merge(o.copy(e), { m: i, d: n, ksi: u }));
                  }
                } else
                  (c.resolvedType instanceof r || null != n[d]) &&
                    s(c, a, d, o.merge(o.copy(e), { m: i, d: n }));
              }
              return i;
            };
          };
        }),
        (i.toObject = function (e) {
          var t = e.fieldsArray.slice().sort(o.compareFieldsById);
          return function (n) {
            return t.length
              ? function (i, s) {
                  s = s || {};
                  for (
                    var u, c, d = {}, l = [], p = [], f = [], h = 0;
                    h < t.length;
                    ++h
                  )
                    t[h].partOf ||
                      (t[h].resolve().repeated ? l : t[h].map ? p : f).push(
                        t[h]
                      );
                  if (l.length && (s.arrays || s.defaults))
                    for (h = 0; h < l.length; ++h) d[l[h].name] = [];
                  if (p.length && (s.objects || s.defaults))
                    for (h = 0; h < p.length; ++h) d[p[h].name] = {};
                  if (f.length && s.defaults)
                    for (h = 0; h < f.length; ++h)
                      if (((c = (u = f[h]).name), u.resolvedType instanceof r))
                        d[c] = s.enums = String
                          ? u.resolvedType.valuesById[u.typeDefault]
                          : u.typeDefault;
                      else if (u.long)
                        if (o.Long) {
                          var g = new o.Long(
                            u.typeDefault.low,
                            u.typeDefault.high,
                            u.typeDefault.unsigned
                          );
                          d[c] =
                            s.longs === String
                              ? g.toString()
                              : s.longs === Number
                              ? g.toNumber()
                              : g;
                        } else
                          d[c] =
                            s.longs === String
                              ? u.typeDefault.toString()
                              : u.typeDefault.toNumber();
                      else
                        u.bytes
                          ? (d[c] =
                              s.bytes === String
                                ? String.fromCharCode.apply(
                                    String,
                                    u.typeDefault
                                  )
                                : Array.prototype.slice
                                    .call(u.typeDefault)
                                    .join("*..*")
                                    .split("*..*"))
                          : (d[c] = u.typeDefault);
                  var y = !1;
                  for (h = 0; h < t.length; ++h) {
                    c = (u = t[h]).name;
                    var m,
                      v,
                      _ = e._fieldsArray.indexOf(u);
                    if (u.map) {
                      if (
                        (y || (y = !0), i[c] && (m = Object.keys(i[c]).length))
                      )
                        for (d[c] = {}, v = 0; v < m.length; ++v)
                          a(
                            u,
                            _,
                            c,
                            o.merge(o.copy(n), { m: i, d: d, ksi: m[v], o: s })
                          );
                    } else if (u.repeated) {
                      if (i[c] && i[c].length)
                        for (d[c] = [], v = 0; v < i[c].length; ++v)
                          a(
                            u,
                            _,
                            c,
                            o.merge(o.copy(n), { m: i, d: d, ksi: v, o: s })
                          );
                    } else
                      null != i[c] &&
                        i.hasOwnProperty(c) &&
                        a(u, _, c, o.merge(o.copy(n), { m: i, d: d, o: s })),
                        u.partOf && s.oneofs && (d[u.partOf.name] = c);
                  }
                  return d;
                }
              : function () {
                  return {};
                };
          };
        });
    },
    function (e, t, n) {
      var r, o, i;
      (o = [n(0)]),
        void 0 ===
          (i =
            "function" ==
            typeof (r = function (e) {
              "use strict";
              return (
                e.roots.messagebody || (e.roots.messagebody = new e.Root())
              ).addJSON({
                im: {
                  nested: {
                    floo: {
                      nested: {
                        protobuf: {
                          nested: {
                            MessageOperation: {
                              fields: {
                                type: { type: "OpType", id: 1 },
                                mid: { type: "uint64", id: 2 },
                                xid: { type: "XID", id: 3 },
                              },
                              nested: {
                                OpType: {
                                  values: {
                                    UNKNOWN: 0,
                                    READ_ACK: 1,
                                    READ_ALL: 2,
                                    READ_CANCEL: 3,
                                    DELIVER_ACK: 4,
                                    RECALL: 5,
                                    DELETE: 6,
                                    PLAY_ACK: 7,
                                  },
                                },
                              },
                            },
                            MessageBody: {
                              fields: {
                                type: { type: "Type", id: 1 },
                                content: { type: "string", id: 4 },
                                ctype: { type: "ContentType", id: 5 },
                                operation: { type: "MessageOperation", id: 6 },
                                config: { type: "string", id: 7 },
                                attachment: { type: "string", id: 8 },
                                ext: { type: "string", id: 9 },
                                qos: { type: "QoS", id: 10 },
                                sender_name: { type: "string", id: 11 },
                                is_system: { type: "bool", id: 12 },
                                priority: { type: "uint32", id: 13 },
                                status: { type: "Status", id: 14 },
                              },
                              nested: {
                                Type: {
                                  values: {
                                    NORMAL: 0,
                                    OPER: 1,
                                    CHAT: 2,
                                    GROUPCHAT: 3,
                                  },
                                },
                                ContentType: {
                                  values: {
                                    TEXT: 0,
                                    IMAGE: 1,
                                    AUDIO: 2,
                                    VIDEO: 3,
                                    FILE: 4,
                                    LOCATION: 5,
                                    COMMAND: 6,
                                    FORWARD: 7,
                                  },
                                },
                                QoS: {
                                  values: {
                                    AT_LEAST_ONCE: 0,
                                    AT_MOST_ONCE: 1,
                                    EXACTLY_ONCE: 2,
                                  },
                                },
                                Status: {
                                  values: { UNREAD: 0, DELIVERED: 1, READ: 2 },
                                },
                              },
                            },
                            XID: {
                              fields: {
                                uid: { type: "uint64", id: 1 },
                                deviceSN: { type: "uint32", id: 2 },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            })
              ? r.apply(t, o)
              : r) || (e.exports = i);
    },
    function (e, t, n) {
      var r, o, i;
      (o = [n(0)]),
        void 0 ===
          (i =
            "function" ==
            typeof (r = function (e) {
              "use strict";
              return (
                e.roots.groupnotice || (e.roots.groupnotice = new e.Root())
              ).addJSON({
                im: {
                  nested: {
                    floo: {
                      nested: {
                        protobuf: {
                          nested: {
                            GroupNotice: {
                              fields: {
                                type: { type: "Type", id: 1 },
                                gid: { type: "XID", id: 2 },
                                from: { type: "XID", id: 3 },
                                to: { rule: "repeated", type: "XID", id: 4 },
                                content: { type: "string", id: 5 },
                              },
                              nested: {
                                Type: {
                                  values: {
                                    UNKNOWN: 0,
                                    PRESENCE: 1,
                                    ABSENCE: 2,
                                    CREATED: 3,
                                    DESTROYED: 4,
                                    JOINED: 5,
                                    LEAVED: 6,
                                    APPLYED: 7,
                                    APPLY_ACCEPTED: 8,
                                    APPLY_DECLINED: 9,
                                    INVITED: 10,
                                    INVITE_ACCEPTED: 11,
                                    INVITE_DECLINED: 12,
                                    KICKED: 13,
                                    BLOCKED: 14,
                                    UNBLOCKED: 15,
                                    OWNER_ASSIGNED: 16,
                                    ADMIN_GRANTED: 17,
                                    ADMIN_REVOKED: 18,
                                    MUTED: 19,
                                    UNMUTED: 20,
                                    BANNED: 21,
                                    UNBANNED: 22,
                                    INFO_UPDATED: 23,
                                    ANNOUNCEMENT_UPDATED: 24,
                                    MESSAGE_SETTING: 25,
                                    FILE_UPLOADED: 26,
                                    FILE_DELETED: 27,
                                    FILE_UPDATED: 28,
                                  },
                                },
                              },
                            },
                            XID: {
                              fields: {
                                uid: { type: "uint64", id: 1 },
                                deviceSN: { type: "uint32", id: 2 },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            })
              ? r.apply(t, o)
              : r) || (e.exports = i);
    },
    function (e, t, n) {
      var r, o, i;
      (o = [n(0)]),
        void 0 ===
          (i =
            "function" ==
            typeof (r = function (e) {
              "use strict";
              return (
                e.roots.rosternotice || (e.roots.rosternotice = new e.Root())
              ).addJSON({
                im: {
                  nested: {
                    floo: {
                      nested: {
                        protobuf: {
                          nested: {
                            RosterNotice: {
                              fields: {
                                type: { type: "Type", id: 1 },
                                from: { type: "XID", id: 2 },
                                to: { rule: "repeated", type: "XID", id: 3 },
                                content: { type: "string", id: 4 },
                                roster_vsn: { type: "string", id: 5 },
                              },
                              nested: {
                                Type: {
                                  values: {
                                    UNKNOWN: 0,
                                    ADDED: 1,
                                    REMOVED: 2,
                                    ACCEPTED: 3,
                                    DECLINED: 4,
                                    APPLIED: 7,
                                    BLOCKED: 5,
                                    UNBLOCKED: 6,
                                    INFO_UPDATED: 8,
                                    MUTED: 9,
                                    UNMUTED: 10,
                                  },
                                },
                              },
                            },
                            XID: {
                              fields: {
                                uid: { type: "uint64", id: 1 },
                                deviceSN: { type: "uint32", id: 2 },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            })
              ? r.apply(t, o)
              : r) || (e.exports = i);
    },
    function (e, t, n) {
      var r, o, i;
      (o = [n(0)]),
        void 0 ===
          (i =
            "function" ==
            typeof (r = function (e) {
              "use strict";
              return (
                e.roots.usernotice || (e.roots.usernotice = new e.Root())
              ).addJSON({
                im: {
                  nested: {
                    floo: {
                      nested: {
                        protobuf: {
                          nested: {
                            UserNotice: {
                              fields: {
                                type: { type: "Type", id: 1 },
                                content: { type: "string", id: 2 },
                              },
                              nested: {
                                Type: {
                                  values: {
                                    UNKNOWN: 0,
                                    PASSWORD_CHANGED: 1,
                                    FROZEN: 2,
                                    REMOVED: 3,
                                    KICK_BY_SAME_DEVICE: 4,
                                    KICKED_BY_OTHER_DEVICE: 5,
                                    INFO_UPDATED: 6,
                                    DEVICE_LOGIN: 7,
                                    DEVICE_LOGOUT: 8,
                                    DEVICE_ADDED: 9,
                                    DEVICE_REMOVED: 10,
                                    CLUSTER_CHANGED: 11,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            })
              ? r.apply(t, o)
              : r) || (e.exports = i);
    },
    function (e, t, n) {
      var r, o, i;
      (o = [n(0)]),
        void 0 ===
          (i =
            "function" ==
            typeof (r = function (e) {
              "use strict";
              return (e.roots.info || (e.roots.info = new e.Root())).addJSON({
                im: {
                  nested: {
                    floo: {
                      nested: {
                        protobuf: {
                          nested: {
                            Info: {
                              fields: {
                                sdk_vsn: { type: "string", id: 1 },
                                network: { type: "Network", id: 2 },
                                content: { type: "string", id: 3 },
                              },
                              nested: {
                                Network: {
                                  values: {
                                    WIRE: 0,
                                    WIFI: 1,
                                    NET_2G: 2,
                                    NET_3G: 3,
                                    NET_4G: 4,
                                    NET_5G: 5,
                                    UNKNOWN: 6,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            })
              ? r.apply(t, o)
              : r) || (e.exports = i);
    },
    function (e, t, n) {
      var r, o, i;
      (o = [n(0)]),
        void 0 ===
          (i =
            "function" ==
            typeof (r = function (e) {
              "use strict";
              return (
                e.roots.conversation || (e.roots.conversation = new e.Root())
              ).addJSON({
                im: {
                  nested: {
                    floo: {
                      nested: {
                        protobuf: {
                          nested: {
                            Conversation: {
                              fields: {
                                type: { type: "Type", id: 1 },
                                operation: {
                                  type: "ConversationOperation",
                                  id: 2,
                                },
                              },
                              nested: {
                                Type: { values: { UNKNOWN: 0, OPER: 1 } },
                              },
                            },
                            ConversationOperation: {
                              fields: {
                                type: { type: "OpType", id: 1 },
                                xid: { type: "XID", id: 2 },
                              },
                              nested: {
                                OpType: {
                                  values: {
                                    UNKNOWN: 0,
                                    DELETE: 1,
                                    DELETE_EVERYWHERE: 2,
                                  },
                                },
                              },
                            },
                            XID: {
                              fields: {
                                uid: { type: "uint64", id: 1 },
                                deviceSN: { type: "uint32", id: 2 },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            })
              ? r.apply(t, o)
              : r) || (e.exports = i);
    },
    function (e, t, n) {
      "use strict";
      e.exports = (e) =>
        encodeURIComponent(e).replace(
          /[!'()*]/g,
          (e) => "%" + e.charCodeAt(0).toString(16).toUpperCase()
        );
    },
    function (e, t, n) {
      "use strict";
      var r = new RegExp("(%[a-f0-9]{2})|([^%]+?)", "gi"),
        o = new RegExp("(%[a-f0-9]{2})+", "gi");
      function i(e, t) {
        try {
          return [decodeURIComponent(e.join(""))];
        } catch (e) {}
        if (1 === e.length) return e;
        t = t || 1;
        var n = e.slice(0, t),
          r = e.slice(t);
        return Array.prototype.concat.call([], i(n), i(r));
      }
      function s(e) {
        try {
          return decodeURIComponent(e);
        } catch (o) {
          for (var t = e.match(r) || [], n = 1; n < t.length; n++)
            t = (e = i(t, n).join("")).match(r) || [];
          return e;
        }
      }
      e.exports = function (e) {
        if ("string" != typeof e)
          throw new TypeError(
            "Expected `encodedURI` to be of type `string`, got `" +
              typeof e +
              "`"
          );
        try {
          return (e = e.replace(/\+/g, " ")), decodeURIComponent(e);
        } catch (t) {
          return (function (e) {
            for (
              var t = { "%FE%FF": "��", "%FF%FE": "��" }, n = o.exec(e);
              n;

            ) {
              try {
                t[n[0]] = decodeURIComponent(n[0]);
              } catch (e) {
                var r = s(n[0]);
                r !== n[0] && (t[n[0]] = r);
              }
              n = o.exec(e);
            }
            t["%C2"] = "�";
            for (var i = Object.keys(t), a = 0; a < i.length; a++) {
              var u = i[a];
              e = e.replace(new RegExp(u, "g"), t[u]);
            }
            return e;
          })(e);
        }
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = (e, t) => {
        if ("string" != typeof e || "string" != typeof t)
          throw new TypeError("Expected the arguments to be of type `string`");
        if ("" === t) return [e];
        const n = e.indexOf(t);
        return -1 === n ? [e] : [e.slice(0, n), e.slice(n + t.length)];
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e, t) {
        for (
          var n = {}, r = Object.keys(e), o = Array.isArray(t), i = 0;
          i < r.length;
          i++
        ) {
          var s = r[i],
            a = e[s];
          (o ? -1 !== t.indexOf(s) : t(s, a, e)) && (n[s] = a);
        }
        return n;
      };
    },
    function (e, t) {
      e.exports = r;
      var n = null;
      try {
        n = new WebAssembly.Instance(
          new WebAssembly.Module(
            new Uint8Array([
              0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127,
              127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1,
              65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95,
              115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95,
              115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95,
              104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1,
              1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32,
              3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32,
              4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134,
              132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32,
              135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1,
              173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132,
              128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1,
              126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3,
              173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4,
              167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132,
              32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135,
              167, 36, 0, 32, 4, 167, 11,
            ])
          ),
          {}
        ).exports;
      } catch (e) {}
      function r(e, t, n) {
        (this.low = 0 | e), (this.high = 0 | t), (this.unsigned = !!n);
      }
      function o(e) {
        return !0 === (e && e.__isLong__);
      }
      r.prototype.__isLong__,
        Object.defineProperty(r.prototype, "__isLong__", { value: !0 }),
        (r.isLong = o);
      var i = {},
        s = {};
      function a(e, t) {
        var n, r, o;
        return t
          ? (o = 0 <= (e >>>= 0) && e < 256) && (r = s[e])
            ? r
            : ((n = c(e, (0 | e) < 0 ? -1 : 0, !0)), o && (s[e] = n), n)
          : (o = -128 <= (e |= 0) && e < 128) && (r = i[e])
          ? r
          : ((n = c(e, e < 0 ? -1 : 0, !1)), o && (i[e] = n), n);
      }
      function u(e, t) {
        if (isNaN(e)) return t ? v : m;
        if (t) {
          if (e < 0) return v;
          if (e >= h) return A;
        } else {
          if (e <= -g) return w;
          if (e + 1 >= g) return b;
        }
        return e < 0 ? u(-e, t).neg() : c(e % f | 0, (e / f) | 0, t);
      }
      function c(e, t, n) {
        return new r(e, t, n);
      }
      (r.fromInt = a), (r.fromNumber = u), (r.fromBits = c);
      var d = Math.pow;
      function l(e, t, n) {
        if (0 === e.length) throw Error("empty string");
        if (
          "NaN" === e ||
          "Infinity" === e ||
          "+Infinity" === e ||
          "-Infinity" === e
        )
          return m;
        if (
          ("number" == typeof t ? ((n = t), (t = !1)) : (t = !!t),
          (n = n || 10) < 2 || 36 < n)
        )
          throw RangeError("radix");
        var r;
        if ((r = e.indexOf("-")) > 0) throw Error("interior hyphen");
        if (0 === r) return l(e.substring(1), t, n).neg();
        for (var o = u(d(n, 8)), i = m, s = 0; s < e.length; s += 8) {
          var a = Math.min(8, e.length - s),
            c = parseInt(e.substring(s, s + a), n);
          if (a < 8) {
            var p = u(d(n, a));
            i = i.mul(p).add(u(c));
          } else i = (i = i.mul(o)).add(u(c));
        }
        return (i.unsigned = t), i;
      }
      function p(e, t) {
        return "number" == typeof e
          ? u(e, t)
          : "string" == typeof e
          ? l(e, t)
          : c(e.low, e.high, "boolean" == typeof t ? t : e.unsigned);
      }
      (r.fromString = l), (r.fromValue = p);
      var f = 4294967296,
        h = f * f,
        g = h / 2,
        y = a(1 << 24),
        m = a(0);
      r.ZERO = m;
      var v = a(0, !0);
      r.UZERO = v;
      var _ = a(1);
      r.ONE = _;
      var E = a(1, !0);
      r.UONE = E;
      var N = a(-1);
      r.NEG_ONE = N;
      var b = c(-1, 2147483647, !1);
      r.MAX_VALUE = b;
      var A = c(-1, -1, !0);
      r.MAX_UNSIGNED_VALUE = A;
      var w = c(0, -2147483648, !1);
      r.MIN_VALUE = w;
      var O = r.prototype;
      (O.toInt = function () {
        return this.unsigned ? this.low >>> 0 : this.low;
      }),
        (O.toNumber = function () {
          return this.unsigned
            ? (this.high >>> 0) * f + (this.low >>> 0)
            : this.high * f + (this.low >>> 0);
        }),
        (O.toString = function (e) {
          if ((e = e || 10) < 2 || 36 < e) throw RangeError("radix");
          if (this.isZero()) return "0";
          if (this.isNegative()) {
            if (this.eq(w)) {
              var t = u(e),
                n = this.div(t),
                r = n.mul(t).sub(this);
              return n.toString(e) + r.toInt().toString(e);
            }
            return "-" + this.neg().toString(e);
          }
          for (var o = u(d(e, 6), this.unsigned), i = this, s = ""; ; ) {
            var a = i.div(o),
              c = (i.sub(a.mul(o)).toInt() >>> 0).toString(e);
            if ((i = a).isZero()) return c + s;
            for (; c.length < 6; ) c = "0" + c;
            s = "" + c + s;
          }
        }),
        (O.getHighBits = function () {
          return this.high;
        }),
        (O.getHighBitsUnsigned = function () {
          return this.high >>> 0;
        }),
        (O.getLowBits = function () {
          return this.low;
        }),
        (O.getLowBitsUnsigned = function () {
          return this.low >>> 0;
        }),
        (O.getNumBitsAbs = function () {
          if (this.isNegative())
            return this.eq(w) ? 64 : this.neg().getNumBitsAbs();
          for (
            var e = 0 != this.high ? this.high : this.low, t = 31;
            t > 0 && 0 == (e & (1 << t));
            t--
          );
          return 0 != this.high ? t + 33 : t + 1;
        }),
        (O.isZero = function () {
          return 0 === this.high && 0 === this.low;
        }),
        (O.eqz = O.isZero),
        (O.isNegative = function () {
          return !this.unsigned && this.high < 0;
        }),
        (O.isPositive = function () {
          return this.unsigned || this.high >= 0;
        }),
        (O.isOdd = function () {
          return 1 == (1 & this.low);
        }),
        (O.isEven = function () {
          return 0 == (1 & this.low);
        }),
        (O.equals = function (e) {
          return (
            o(e) || (e = p(e)),
            (this.unsigned === e.unsigned ||
              this.high >>> 31 != 1 ||
              e.high >>> 31 != 1) &&
              this.high === e.high &&
              this.low === e.low
          );
        }),
        (O.eq = O.equals),
        (O.notEquals = function (e) {
          return !this.eq(e);
        }),
        (O.neq = O.notEquals),
        (O.ne = O.notEquals),
        (O.lessThan = function (e) {
          return this.comp(e) < 0;
        }),
        (O.lt = O.lessThan),
        (O.lessThanOrEqual = function (e) {
          return this.comp(e) <= 0;
        }),
        (O.lte = O.lessThanOrEqual),
        (O.le = O.lessThanOrEqual),
        (O.greaterThan = function (e) {
          return this.comp(e) > 0;
        }),
        (O.gt = O.greaterThan),
        (O.greaterThanOrEqual = function (e) {
          return this.comp(e) >= 0;
        }),
        (O.gte = O.greaterThanOrEqual),
        (O.ge = O.greaterThanOrEqual),
        (O.compare = function (e) {
          if ((o(e) || (e = p(e)), this.eq(e))) return 0;
          var t = this.isNegative(),
            n = e.isNegative();
          return t && !n
            ? -1
            : !t && n
            ? 1
            : this.unsigned
            ? e.high >>> 0 > this.high >>> 0 ||
              (e.high === this.high && e.low >>> 0 > this.low >>> 0)
              ? -1
              : 1
            : this.sub(e).isNegative()
            ? -1
            : 1;
        }),
        (O.comp = O.compare),
        (O.negate = function () {
          return !this.unsigned && this.eq(w) ? w : this.not().add(_);
        }),
        (O.neg = O.negate),
        (O.add = function (e) {
          o(e) || (e = p(e));
          var t = this.high >>> 16,
            n = 65535 & this.high,
            r = this.low >>> 16,
            i = 65535 & this.low,
            s = e.high >>> 16,
            a = 65535 & e.high,
            u = e.low >>> 16,
            d = 0,
            l = 0,
            f = 0,
            h = 0;
          return (
            (f += (h += i + (65535 & e.low)) >>> 16),
            (l += (f += r + u) >>> 16),
            (d += (l += n + a) >>> 16),
            (d += t + s),
            c(
              ((f &= 65535) << 16) | (h &= 65535),
              ((d &= 65535) << 16) | (l &= 65535),
              this.unsigned
            )
          );
        }),
        (O.subtract = function (e) {
          return o(e) || (e = p(e)), this.add(e.neg());
        }),
        (O.sub = O.subtract),
        (O.multiply = function (e) {
          if (this.isZero()) return m;
          if ((o(e) || (e = p(e)), n))
            return c(
              n.mul(this.low, this.high, e.low, e.high),
              n.get_high(),
              this.unsigned
            );
          if (e.isZero()) return m;
          if (this.eq(w)) return e.isOdd() ? w : m;
          if (e.eq(w)) return this.isOdd() ? w : m;
          if (this.isNegative())
            return e.isNegative()
              ? this.neg().mul(e.neg())
              : this.neg().mul(e).neg();
          if (e.isNegative()) return this.mul(e.neg()).neg();
          if (this.lt(y) && e.lt(y))
            return u(this.toNumber() * e.toNumber(), this.unsigned);
          var t = this.high >>> 16,
            r = 65535 & this.high,
            i = this.low >>> 16,
            s = 65535 & this.low,
            a = e.high >>> 16,
            d = 65535 & e.high,
            l = e.low >>> 16,
            f = 65535 & e.low,
            h = 0,
            g = 0,
            v = 0,
            _ = 0;
          return (
            (v += (_ += s * f) >>> 16),
            (g += (v += i * f) >>> 16),
            (v &= 65535),
            (g += (v += s * l) >>> 16),
            (h += (g += r * f) >>> 16),
            (g &= 65535),
            (h += (g += i * l) >>> 16),
            (g &= 65535),
            (h += (g += s * d) >>> 16),
            (h += t * f + r * l + i * d + s * a),
            c(
              ((v &= 65535) << 16) | (_ &= 65535),
              ((h &= 65535) << 16) | (g &= 65535),
              this.unsigned
            )
          );
        }),
        (O.mul = O.multiply),
        (O.divide = function (e) {
          if ((o(e) || (e = p(e)), e.isZero())) throw Error("division by zero");
          var t, r, i;
          if (n)
            return this.unsigned ||
              -2147483648 !== this.high ||
              -1 !== e.low ||
              -1 !== e.high
              ? c(
                  (this.unsigned ? n.div_u : n.div_s)(
                    this.low,
                    this.high,
                    e.low,
                    e.high
                  ),
                  n.get_high(),
                  this.unsigned
                )
              : this;
          if (this.isZero()) return this.unsigned ? v : m;
          if (this.unsigned) {
            if ((e.unsigned || (e = e.toUnsigned()), e.gt(this))) return v;
            if (e.gt(this.shru(1))) return E;
            i = v;
          } else {
            if (this.eq(w))
              return e.eq(_) || e.eq(N)
                ? w
                : e.eq(w)
                ? _
                : (t = this.shr(1).div(e).shl(1)).eq(m)
                ? e.isNegative()
                  ? _
                  : N
                : ((r = this.sub(e.mul(t))), (i = t.add(r.div(e))));
            if (e.eq(w)) return this.unsigned ? v : m;
            if (this.isNegative())
              return e.isNegative()
                ? this.neg().div(e.neg())
                : this.neg().div(e).neg();
            if (e.isNegative()) return this.div(e.neg()).neg();
            i = m;
          }
          for (r = this; r.gte(e); ) {
            t = Math.max(1, Math.floor(r.toNumber() / e.toNumber()));
            for (
              var s = Math.ceil(Math.log(t) / Math.LN2),
                a = s <= 48 ? 1 : d(2, s - 48),
                l = u(t),
                f = l.mul(e);
              f.isNegative() || f.gt(r);

            )
              f = (l = u((t -= a), this.unsigned)).mul(e);
            l.isZero() && (l = _), (i = i.add(l)), (r = r.sub(f));
          }
          return i;
        }),
        (O.div = O.divide),
        (O.modulo = function (e) {
          return (
            o(e) || (e = p(e)),
            n
              ? c(
                  (this.unsigned ? n.rem_u : n.rem_s)(
                    this.low,
                    this.high,
                    e.low,
                    e.high
                  ),
                  n.get_high(),
                  this.unsigned
                )
              : this.sub(this.div(e).mul(e))
          );
        }),
        (O.mod = O.modulo),
        (O.rem = O.modulo),
        (O.not = function () {
          return c(~this.low, ~this.high, this.unsigned);
        }),
        (O.and = function (e) {
          return (
            o(e) || (e = p(e)),
            c(this.low & e.low, this.high & e.high, this.unsigned)
          );
        }),
        (O.or = function (e) {
          return (
            o(e) || (e = p(e)),
            c(this.low | e.low, this.high | e.high, this.unsigned)
          );
        }),
        (O.xor = function (e) {
          return (
            o(e) || (e = p(e)),
            c(this.low ^ e.low, this.high ^ e.high, this.unsigned)
          );
        }),
        (O.shiftLeft = function (e) {
          return (
            o(e) && (e = e.toInt()),
            0 == (e &= 63)
              ? this
              : e < 32
              ? c(
                  this.low << e,
                  (this.high << e) | (this.low >>> (32 - e)),
                  this.unsigned
                )
              : c(0, this.low << (e - 32), this.unsigned)
          );
        }),
        (O.shl = O.shiftLeft),
        (O.shiftRight = function (e) {
          return (
            o(e) && (e = e.toInt()),
            0 == (e &= 63)
              ? this
              : e < 32
              ? c(
                  (this.low >>> e) | (this.high << (32 - e)),
                  this.high >> e,
                  this.unsigned
                )
              : c(this.high >> (e - 32), this.high >= 0 ? 0 : -1, this.unsigned)
          );
        }),
        (O.shr = O.shiftRight),
        (O.shiftRightUnsigned = function (e) {
          if ((o(e) && (e = e.toInt()), 0 === (e &= 63))) return this;
          var t = this.high;
          return e < 32
            ? c((this.low >>> e) | (t << (32 - e)), t >>> e, this.unsigned)
            : c(32 === e ? t : t >>> (e - 32), 0, this.unsigned);
        }),
        (O.shru = O.shiftRightUnsigned),
        (O.shr_u = O.shiftRightUnsigned),
        (O.toSigned = function () {
          return this.unsigned ? c(this.low, this.high, !1) : this;
        }),
        (O.toUnsigned = function () {
          return this.unsigned ? this : c(this.low, this.high, !0);
        }),
        (O.toBytes = function (e) {
          return e ? this.toBytesLE() : this.toBytesBE();
        }),
        (O.toBytesLE = function () {
          var e = this.high,
            t = this.low;
          return [
            255 & t,
            (t >>> 8) & 255,
            (t >>> 16) & 255,
            t >>> 24,
            255 & e,
            (e >>> 8) & 255,
            (e >>> 16) & 255,
            e >>> 24,
          ];
        }),
        (O.toBytesBE = function () {
          var e = this.high,
            t = this.low;
          return [
            e >>> 24,
            (e >>> 16) & 255,
            (e >>> 8) & 255,
            255 & e,
            t >>> 24,
            (t >>> 16) & 255,
            (t >>> 8) & 255,
            255 & t,
          ];
        }),
        (r.fromBytes = function (e, t, n) {
          return n ? r.fromBytesLE(e, t) : r.fromBytesBE(e, t);
        }),
        (r.fromBytesLE = function (e, t) {
          return new r(
            e[0] | (e[1] << 8) | (e[2] << 16) | (e[3] << 24),
            e[4] | (e[5] << 8) | (e[6] << 16) | (e[7] << 24),
            t
          );
        }),
        (r.fromBytesBE = function (e, t) {
          return new r(
            (e[4] << 24) | (e[5] << 16) | (e[6] << 8) | e[7],
            (e[0] << 24) | (e[1] << 16) | (e[2] << 8) | e[3],
            t
          );
        });
    },
    function (e, t) {
      e.exports = function (e, t, n) {
        var r = n || 8192,
          o = r >>> 1,
          i = null,
          s = r;
        return function (n) {
          if (n < 1 || n > o) return e(n);
          s + n > r && ((i = e(r)), (s = 0));
          var a = t.call(i, s, (s += n));
          return 7 & s && (s = 1 + (7 | s)), a;
        };
      };
    },
    function (e, t) {
      function n(e) {
        return (
          "undefined" != typeof Float32Array
            ? (function () {
                var t = new Float32Array([-0]),
                  n = new Uint8Array(t.buffer),
                  r = 128 === n[3];
                function o(e, r, o) {
                  (t[0] = e),
                    (r[o] = n[0]),
                    (r[o + 1] = n[1]),
                    (r[o + 2] = n[2]),
                    (r[o + 3] = n[3]);
                }
                function i(e, r, o) {
                  (t[0] = e),
                    (r[o] = n[3]),
                    (r[o + 1] = n[2]),
                    (r[o + 2] = n[1]),
                    (r[o + 3] = n[0]);
                }
                function s(e, r) {
                  return (
                    (n[0] = e[r]),
                    (n[1] = e[r + 1]),
                    (n[2] = e[r + 2]),
                    (n[3] = e[r + 3]),
                    t[0]
                  );
                }
                function a(e, r) {
                  return (
                    (n[3] = e[r]),
                    (n[2] = e[r + 1]),
                    (n[1] = e[r + 2]),
                    (n[0] = e[r + 3]),
                    t[0]
                  );
                }
                (e.writeFloatLE = r ? o : i),
                  (e.writeFloatBE = r ? i : o),
                  (e.readFloatLE = r ? s : a),
                  (e.readFloatBE = r ? a : s);
              })()
            : (function () {
                function t(e, t, n, r) {
                  var o = t < 0 ? 1 : 0;
                  if ((o && (t = -t), 0 === t))
                    e(1 / t > 0 ? 0 : 2147483648, n, r);
                  else if (isNaN(t)) e(2143289344, n, r);
                  else if (t > 34028234663852886e22)
                    e(((o << 31) | 2139095040) >>> 0, n, r);
                  else if (t < 11754943508222875e-54)
                    e(
                      ((o << 31) | Math.round(t / 1401298464324817e-60)) >>> 0,
                      n,
                      r
                    );
                  else {
                    var i = Math.floor(Math.log(t) / Math.LN2);
                    e(
                      ((o << 31) |
                        ((i + 127) << 23) |
                        (8388607 &
                          Math.round(t * Math.pow(2, -i) * 8388608))) >>>
                        0,
                      n,
                      r
                    );
                  }
                }
                function n(e, t, n) {
                  var r = e(t, n),
                    o = 2 * (r >> 31) + 1,
                    i = (r >>> 23) & 255,
                    s = 8388607 & r;
                  return 255 === i
                    ? s
                      ? NaN
                      : o * (1 / 0)
                    : 0 === i
                    ? 1401298464324817e-60 * o * s
                    : o * Math.pow(2, i - 150) * (s + 8388608);
                }
                (e.writeFloatLE = t.bind(null, r)),
                  (e.writeFloatBE = t.bind(null, o)),
                  (e.readFloatLE = n.bind(null, i)),
                  (e.readFloatBE = n.bind(null, s));
              })(),
          "undefined" != typeof Float64Array
            ? (function () {
                var t = new Float64Array([-0]),
                  n = new Uint8Array(t.buffer),
                  r = 128 === n[7];
                function o(e, r, o) {
                  (t[0] = e),
                    (r[o] = n[0]),
                    (r[o + 1] = n[1]),
                    (r[o + 2] = n[2]),
                    (r[o + 3] = n[3]),
                    (r[o + 4] = n[4]),
                    (r[o + 5] = n[5]),
                    (r[o + 6] = n[6]),
                    (r[o + 7] = n[7]);
                }
                function i(e, r, o) {
                  (t[0] = e),
                    (r[o] = n[7]),
                    (r[o + 1] = n[6]),
                    (r[o + 2] = n[5]),
                    (r[o + 3] = n[4]),
                    (r[o + 4] = n[3]),
                    (r[o + 5] = n[2]),
                    (r[o + 6] = n[1]),
                    (r[o + 7] = n[0]);
                }
                function s(e, r) {
                  return (
                    (n[0] = e[r]),
                    (n[1] = e[r + 1]),
                    (n[2] = e[r + 2]),
                    (n[3] = e[r + 3]),
                    (n[4] = e[r + 4]),
                    (n[5] = e[r + 5]),
                    (n[6] = e[r + 6]),
                    (n[7] = e[r + 7]),
                    t[0]
                  );
                }
                function a(e, r) {
                  return (
                    (n[7] = e[r]),
                    (n[6] = e[r + 1]),
                    (n[5] = e[r + 2]),
                    (n[4] = e[r + 3]),
                    (n[3] = e[r + 4]),
                    (n[2] = e[r + 5]),
                    (n[1] = e[r + 6]),
                    (n[0] = e[r + 7]),
                    t[0]
                  );
                }
                (e.writeDoubleLE = r ? o : i),
                  (e.writeDoubleBE = r ? i : o),
                  (e.readDoubleLE = r ? s : a),
                  (e.readDoubleBE = r ? a : s);
              })()
            : (function () {
                function t(e, t, n, r, o, i) {
                  var s = r < 0 ? 1 : 0;
                  if ((s && (r = -r), 0 === r))
                    e(0, o, i + t), e(1 / r > 0 ? 0 : 2147483648, o, i + n);
                  else if (isNaN(r)) e(0, o, i + t), e(2146959360, o, i + n);
                  else if (r > 17976931348623157e292)
                    e(0, o, i + t), e(((s << 31) | 2146435072) >>> 0, o, i + n);
                  else {
                    var a;
                    if (r < 22250738585072014e-324)
                      e((a = r / 5e-324) >>> 0, o, i + t),
                        e(((s << 31) | (a / 4294967296)) >>> 0, o, i + n);
                    else {
                      var u = Math.floor(Math.log(r) / Math.LN2);
                      1024 === u && (u = 1023),
                        e(
                          (4503599627370496 * (a = r * Math.pow(2, -u))) >>> 0,
                          o,
                          i + t
                        ),
                        e(
                          ((s << 31) |
                            ((u + 1023) << 20) |
                            ((1048576 * a) & 1048575)) >>>
                            0,
                          o,
                          i + n
                        );
                    }
                  }
                }
                function n(e, t, n, r, o) {
                  var i = e(r, o + t),
                    s = e(r, o + n),
                    a = 2 * (s >> 31) + 1,
                    u = (s >>> 20) & 2047,
                    c = 4294967296 * (1048575 & s) + i;
                  return 2047 === u
                    ? c
                      ? NaN
                      : a * (1 / 0)
                    : 0 === u
                    ? 5e-324 * a * c
                    : a * Math.pow(2, u - 1075) * (c + 4503599627370496);
                }
                (e.writeDoubleLE = t.bind(null, r, 0, 4)),
                  (e.writeDoubleBE = t.bind(null, o, 4, 0)),
                  (e.readDoubleLE = n.bind(null, i, 0, 4)),
                  (e.readDoubleBE = n.bind(null, s, 4, 0));
              })(),
          e
        );
      }
      function r(e, t, n) {
        (t[n] = 255 & e),
          (t[n + 1] = (e >>> 8) & 255),
          (t[n + 2] = (e >>> 16) & 255),
          (t[n + 3] = e >>> 24);
      }
      function o(e, t, n) {
        (t[n] = e >>> 24),
          (t[n + 1] = (e >>> 16) & 255),
          (t[n + 2] = (e >>> 8) & 255),
          (t[n + 3] = 255 & e);
      }
      function i(e, t) {
        return (
          (e[t] | (e[t + 1] << 8) | (e[t + 2] << 16) | (e[t + 3] << 24)) >>> 0
        );
      }
      function s(e, t) {
        return (
          ((e[t] << 24) | (e[t + 1] << 16) | (e[t + 2] << 8) | e[t + 3]) >>> 0
        );
      }
      e.exports = n(n);
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e, t) {
        var n = new Array(arguments.length - 1),
          r = 0,
          o = 2,
          i = !0;
        for (; o < arguments.length; ) n[r++] = arguments[o++];
        return new Promise(function (o, s) {
          n[r] = function (e) {
            if (i)
              if (((i = !1), e)) s(e);
              else {
                for (
                  var t = new Array(arguments.length - 1), n = 0;
                  n < t.length;

                )
                  t[n++] = arguments[n];
                o.apply(null, t);
              }
          };
          try {
            e.apply(t || null, n);
          } catch (e) {
            i && ((i = !1), s(e));
          }
        });
      };
    },
    function (e, t, n) {
      "use strict";
      function r() {
        this._listeners = {};
      }
      (e.exports = r),
        (r.prototype.on = function (e, t, n) {
          return (
            (this._listeners[e] || (this._listeners[e] = [])).push({
              fn: t,
              ctx: n || this,
            }),
            this
          );
        }),
        (r.prototype.off = function (e, t) {
          if (void 0 === e) this._listeners = {};
          else if (void 0 === t) this._listeners[e] = [];
          else
            for (var n = this._listeners[e], r = 0; r < n.length; )
              n[r].fn === t ? n.splice(r, 1) : ++r;
          return this;
        }),
        (r.prototype.emit = function (e) {
          var t = this._listeners[e];
          if (t) {
            for (var n = [], r = 1; r < arguments.length; )
              n.push(arguments[r++]);
            for (r = 0; r < t.length; ) t[r].fn.apply(t[r++].ctx, n);
          }
          return this;
        });
    },
    function (e, t) {
      var n = e.exports,
        r = (n.isAbsolute = function (e) {
          return /^(?:\/|\w+:)/.test(e);
        }),
        o = (n.normalize = function (e) {
          var t = (e = e.replace(/\\/g, "/").replace(/\/{2,}/g, "/")).split(
              "/"
            ),
            n = r(e),
            o = "";
          n && (o = t.shift() + "/");
          for (var i = 0; i < t.length; )
            ".." === t[i]
              ? i > 0 && ".." !== t[i - 1]
                ? t.splice(--i, 2)
                : n
                ? t.splice(i, 1)
                : ++i
              : "." === t[i]
              ? t.splice(i, 1)
              : ++i;
          return o + t.join("/");
        });
      n.resolve = function (e, t, n) {
        return (
          n || (t = o(t)),
          r(t)
            ? t
            : (n || (e = o(e)),
              (e = e.replace(/(?:\/|^)[^/]+$/, "")).length ? o(e + "/" + t) : t)
        );
      };
    },
    function (e, t, n) {
      "use strict";
      n.r(t),
        n.d(t, "flooim", function () {
          return ui;
        });
      var r = {};
      n.r(r),
        n.d(r, "STATIC_FRAME_VSN", function () {
          return h;
        }),
        n.d(r, "STATIC_FRAME_COMMAND", function () {
          return g;
        }),
        n.d(r, "STATIC_FRAME_COMPRESS_METHOD", function () {
          return y;
        }),
        n.d(r, "STATIC_FRAME_ERROR_STATUS", function () {
          return m;
        }),
        n.d(r, "STATIC_FRAME_OSTYPE", function () {
          return v;
        }),
        n.d(r, "STATIC_FRAME_ENCRYPTMETHOD", function () {
          return _;
        }),
        n.d(r, "STATIC_META_NAMESPACE", function () {
          return E;
        }),
        n.d(r, "STATIC_MESSAGE_OPTYPE", function () {
          return b;
        }),
        n.d(r, "STATIC_MESSAGE_TYPE", function () {
          return N;
        }),
        n.d(r, "STATIC_MESSAGE_CONTENT_TYPE", function () {
          return A;
        }),
        n.d(r, "STATIC_MESSAGE_QOS", function () {
          return w;
        }),
        n.d(r, "STATIC_GROUPNOTICE_TYPE", function () {
          return O;
        }),
        n.d(r, "STATIC_INFO_NETWORK", function () {
          return S;
        }),
        n.d(r, "STATIC_USERNOTICE_TYPE", function () {
          return k;
        }),
        n.d(r, "STATIC_ROSTERNONTICE_TYPE", function () {
          return I;
        }),
        n.d(r, "STATIC_CONVERSATION_TYPE", function () {
          return R;
        }),
        n.d(r, "STATIC_CONVERSATION_OPTYPE", function () {
          return T;
        }),
        n.d(r, "STATIC_MESSAGE_STATUS", function () {
          return D;
        });
      var o = {};
      n.r(o),
        n.d(o, "getServers", function () {
          return be;
        }),
        n.d(o, "tokenUser", function () {
          return Ae;
        }),
        n.d(o, "tokenId", function () {
          return we;
        }),
        n.d(o, "userRegister", function () {
          return Oe;
        }),
        n.d(o, "userBindMobile", function () {
          return Se;
        }),
        n.d(o, "userSendSms", function () {
          return ke;
        }),
        n.d(o, "userNameCheck", function () {
          return Re;
        }),
        n.d(o, "userMobileBind", function () {
          return Te;
        }),
        n.d(o, "userMobileBindSign", function () {
          return De;
        }),
        n.d(o, "userMobileLogin", function () {
          return Me;
        }),
        n.d(o, "userUpdateMobile", function () {
          return Ie;
        }),
        n.d(o, "captchaImagePost", function () {
          return Ce;
        }),
        n.d(o, "captchaSms", function () {
          return Ue;
        }),
        n.d(o, "rosterAccept", function () {
          return xe;
        }),
        n.d(o, "rosterApply", function () {
          return Ge;
        }),
        n.d(o, "rosterDecline", function () {
          return Le;
        }),
        n.d(o, "rosterDelete", function () {
          return Pe;
        }),
        n.d(o, "rosterExt", function () {
          return Be;
        }),
        n.d(o, "rosterId", function () {
          return je;
        }),
        n.d(o, "rosterList", function () {
          return Fe;
        }),
        n.d(o, "rosterListPost", function () {
          return Ve;
        }),
        n.d(o, "rosterName", function () {
          return qe;
        }),
        n.d(o, "rosterApplylist", function () {
          return Je;
        }),
        n.d(o, "rosterBlockedlist", function () {
          return Ke;
        }),
        n.d(o, "rosterBlockedAdd", function () {
          return Ye;
        }),
        n.d(o, "rosterBlockeRemove", function () {
          return We;
        }),
        n.d(o, "groupAdminAdd", function () {
          return He;
        }),
        n.d(o, "groupAdminList", function () {
          return Ze;
        }),
        n.d(o, "groupAdminRemove", function () {
          return Xe;
        }),
        n.d(o, "groupAnnouncement", function () {
          return $e;
        }),
        n.d(o, "groupAnnouncementDelete", function () {
          return ze;
        }),
        n.d(o, "groupAnnouncementEdit", function () {
          return Qe;
        }),
        n.d(o, "groupAnnouncementList", function () {
          return et;
        }),
        n.d(o, "groupCreate", function () {
          return tt;
        }),
        n.d(o, "groupDestroy", function () {
          return nt;
        }),
        n.d(o, "groupInfo", function () {
          return rt;
        }),
        n.d(o, "groupInfoAvatar", function () {
          return ot;
        }),
        n.d(o, "groupInfoDdscription", function () {
          return it;
        }),
        n.d(o, "groupInfoExt", function () {
          return st;
        }),
        n.d(o, "groupInfoName", function () {
          return at;
        }),
        n.d(o, "groupMemberlist", function () {
          return ut;
        }),
        n.d(o, "groupMsgMutemode", function () {
          return ct;
        }),
        n.d(o, "groupMsgNotdisturb", function () {
          return dt;
        }),
        n.d(o, "groupPubliclist", function () {
          return lt;
        }),
        n.d(o, "groupBannedList", function () {
          return pt;
        }),
        n.d(o, "groupBab", function () {
          return ft;
        }),
        n.d(o, "groupUnban", function () {
          return ht;
        }),
        n.d(o, "groupSettings", function () {
          return gt;
        }),
        n.d(o, "groupSettingsAllowmemberinvitation", function () {
          return yt;
        }),
        n.d(o, "groupSettingsAllowmembermodify", function () {
          return mt;
        }),
        n.d(o, "groupSettingsEnablereadack", function () {
          return vt;
        }),
        n.d(o, "groupSettingsHistoryvisible", function () {
          return _t;
        }),
        n.d(o, "groupSettingsRequireadminapproval", function () {
          return Et;
        }),
        n.d(o, "groupSettingsBanAll", function () {
          return Nt;
        }),
        n.d(o, "groupSettingsUnBanAll", function () {
          return bt;
        }),
        n.d(o, "groupTransfer", function () {
          return At;
        }),
        n.d(o, "groupUserjoined", function () {
          return wt;
        }),
        n.d(o, "groupApply", function () {
          return Ot;
        }),
        n.d(o, "groupApplicationlist", function () {
          return Lt;
        }),
        n.d(o, "groupInvitationlist", function () {
          return Pt;
        }),
        n.d(o, "groupApplyHandle", function () {
          return St;
        }),
        n.d(o, "groupBockedlist", function () {
          return It;
        }),
        n.d(o, "groupBlock", function () {
          return kt;
        }),
        n.d(o, "groupUnblock", function () {
          return Rt;
        }),
        n.d(o, "groupKick", function () {
          return Tt;
        }),
        n.d(o, "groupInvite", function () {
          return Dt;
        }),
        n.d(o, "groupInviteHandle", function () {
          return Mt;
        }),
        n.d(o, "groupInfoBatch", function () {
          return Ct;
        }),
        n.d(o, "groupMembersDidpayname", function () {
          return Ut;
        }),
        n.d(o, "groupLeave", function () {
          return xt;
        }),
        n.d(o, "groupDisplayname", function () {
          return Gt;
        }),
        n.d(o, "groupFilelist", function () {
          return Bt;
        }),
        n.d(o, "groupFiledelete", function () {
          return jt;
        }),
        n.d(o, "groupFileupload", function () {
          return Ft;
        }),
        n.d(o, "userAuthmode", function () {
          return Vt;
        }),
        n.d(o, "userAvatar", function () {
          return qt;
        }),
        n.d(o, "userMobile", function () {
          return Jt;
        }),
        n.d(o, "userNickname", function () {
          return Kt;
        }),
        n.d(o, "userProfile", function () {
          return Yt;
        }),
        n.d(o, "userProfilePost", function () {
          return Wt;
        }),
        n.d(o, "userPush", function () {
          return Ht;
        }),
        n.d(o, "userPushDetail", function () {
          return Zt;
        }),
        n.d(o, "userPushLimit", function () {
          return Xt;
        }),
        n.d(o, "userPushNickname", function () {
          return $t;
        }),
        n.d(o, "userSettings", function () {
          return zt;
        }),
        n.d(o, "userSettingsPost", function () {
          return Qt;
        }),
        n.d(o, "userSounds", function () {
          return en;
        }),
        n.d(o, "userVibratory", function () {
          return tn;
        }),
        n.d(o, "bindDeviceToken", function () {
          return nn;
        }),
        n.d(o, "unbindDeviceToken", function () {
          return rn;
        }),
        n.d(o, "fileForward", function () {
          return on;
        }),
        n.d(o, "asyncFileUpload", function () {
          return sn;
        }),
        n.d(o, "fileUploadAvatarUrl", function () {
          return an;
        }),
        n.d(o, "fileUploadGroupAvatarUrl", function () {
          return un;
        }),
        n.d(o, "fileUploadChatFileUrl", function () {
          return cn;
        }),
        n.d(o, "fileDownloadChatFileUrl", function () {
          return dn;
        }),
        n.d(o, "qrcode", function () {
          return ln;
        }),
        n.d(o, "qrlogin", function () {
          return pn;
        }),
        n.d(o, "qrcodeGroupsign", function () {
          return fn;
        }),
        n.d(o, "qrcodeGroupinvite", function () {
          return hn;
        }),
        n.d(o, "wxbind", function () {
          return gn;
        }),
        n.d(o, "wxlogin", function () {
          return yn;
        }),
        n.d(o, "getStaticContact", function () {
          return mn;
        }),
        n.d(o, "wechatUnbind", function () {
          return vn;
        }),
        n.d(o, "wechatIsbind", function () {
          return _n;
        }),
        n.d(o, "wechatBind", function () {
          return En;
        });
      var i = {};
      n.r(i),
        n.d(i, "decode", function () {
          return dr;
        }),
        n.d(i, "encode", function () {
          return lr;
        });
      var s = {};
      n.r(s),
        n.d(s, "decode", function () {
          return Yr;
        }),
        n.d(s, "encode", function () {
          return Wr;
        });
      var a = {};
      n.r(a),
        n.d(a, "decode", function () {
          return Qr;
        }),
        n.d(a, "encode", function () {
          return eo;
        });
      var u = "debug";
      const c = [];
      const d = () => {
        return (
          "" +
          ((e = new Date()).getFullYear() +
            "-" +
            (e.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            e.getDate().toString().padStart(2, "0") +
            " " +
            e.getHours().toString().padStart(2, "0") +
            ":" +
            e.getMinutes().toString().padStart(2, "0") +
            ":" +
            e.getSeconds().toString().padStart(2, "0") +
            "." +
            e.getMilliseconds().toString().padStart(3, "0"))
        );
        var e;
      };
      var l = {
          error: (...e) => {
            ("debug" != u && "info" != u && "warn" != u && "error" != u) ||
              console.error(d(), "[error]", ...e);
          },
          log: (...e) => {
            "debug" == u && console.log(d(), "[debug]", ...e);
          },
          info: (...e) => {
            ("debug" != u && "info" != u) || console.info(d(), "[info]", ...e);
          },
          warn: (...e) => {
            ("debug" != u && "info" != u && "warn" != u) ||
              console.warn(d(), "[warn]", ...e);
          },
          dir: (...e) => {
            "debug" == u && console.dir(d(), "[dir]", ...e);
          },
          req: (e) => {
            c.push(e), c.length > 5 && c.splice(-5);
          },
          setLogLevel: (e) => {
            u = e;
          },
        },
        p = n(3),
        f = n.n(p);
      const h = { XSYNC_V1: 0, XSYNC_V2: 1 },
        g = { UNREAD: 0, SYNC: 1, NOTICE: 2, PROVISION: 3 },
        y = { NONE: 0, ZLIB: 1 },
        m = {
          UNKNOWN: 0,
          OK: 1,
          FAIL: 2,
          UNKNOWN_COMMAND: 3,
          PB_PARSER_ERROR: 4,
          DECRYPT_FAILURE: 5,
          PUBLIC_KEY_CHANGED: 6,
          INVALID_TOKEN: 7,
          INVALID_PARAMETER: 8,
          UNAUTHORIZED: 9,
          USER_FROZEN: 10,
          USER_BANNED: 11,
          WORD_CENSORED: 12,
          TOO_MANY_DEVICES: 13,
          ENCRYPT_METHOD_UNSUPPORTED: 14,
          DEVICE_GUID_CONFLICT: 15,
          CHECK_SUM_FAILURE: 16,
          INVALID_LICENSE: 17,
          LICENSE_LIMIT: 18,
          APP_FROZEN: 19,
        },
        v = { UNKNOWN: 0, IOS: 1, ANDR: 2, WIN: 3, OSX: 4, LINUX: 5, WEB: 6 },
        _ = { ENCRYPT_NONE: 0, AES_CBC_128: 1, AES_CBC_256: 2, CUSTOM: 3 },
        E = {
          UNKNOWN: 0,
          MESSAGE: 1,
          GROUP_NOTICE: 2,
          ROSTER_NOTICE: 3,
          USER_NOTICE: 4,
          INFO: 5,
          CONVERSATION: 6,
        },
        N = { NORMAL: 0, OPER: 1, CHAT: 2, GROUPCHAT: 3 },
        b = {
          UNKNOWN: 0,
          READ_ACK: 1,
          READ_ALL: 2,
          READ_CANCEL: 3,
          DELIVER_ACK: 4,
          RECALL: 5,
          DELETE: 6,
        },
        A = {
          TEXT: 0,
          IMAGE: 1,
          AUDIO: 2,
          VIDEO: 3,
          FILE: 4,
          LOCATION: 5,
          COMMAND: 6,
          FORWARD: 7,
        },
        w = { AT_LEAST_ONCE: 0, AT_MOST_ONCE: 1, EXACTLY_ONCE: 2 },
        O = {
          UNKNOWN: 0,
          PRESENCE: 1,
          ABSENCE: 2,
          CREATED: 3,
          DESTROYED: 4,
          JOINED: 5,
          LEAVED: 6,
          APPLYED: 7,
          APPLY_ACCEPTED: 8,
          APPLY_DECLINED: 9,
          INVITED: 10,
          INVITE_ACCEPTED: 11,
          INVITE_DECLINED: 12,
          KICKED: 13,
          BLOCKED: 14,
          UNBLOCKED: 15,
          OWNER_ASSIGNED: 16,
          ADMIN_GRANTED: 17,
          ADMIN_REVOKED: 18,
          MUTED: 19,
          UNMUTED: 20,
          BANNED: 21,
          UNBANNED: 22,
          INFO_UPDATED: 23,
          ANNOUNCEMENT_UPDATED: 24,
          MESSAGE_SETTING: 25,
          FILE_UPLOADED: 26,
          FILE_DELETED: 27,
          FILE_UPDATED: 28,
        },
        S = {
          WIRE: 0,
          WIFI: 1,
          NET_2G: 2,
          NET_3G: 3,
          NET_4G: 4,
          NET_5G: 5,
          UNKNOWN: 6,
        },
        I = {
          UNKNOWN: 0,
          ADDED: 1,
          REMOVED: 2,
          ACCEPTED: 3,
          DECLINED: 4,
          BLOCKED: 5,
          UNBLOCKED: 6,
          APPLIED: 7,
          INFO_UPDATED: 8,
          MUTED: 9,
          UNMUTED: 10,
        },
        k = {
          UNKNOWN: 0,
          PASSWORD_CHANGED: 1,
          FROZEN: 2,
          REMOVED: 3,
          KICK_BY_SAME_DEVICE: 4,
          KICKED_BY_OTHER_DEVICE: 5,
          INFO_UPDATED: 6,
          DEVICE_LOGIN: 7,
          DEVICE_LOGOUT: 8,
          DEVICE_ADDED: 9,
          DEVICE_REMOVED: 10,
          CLUSTER_CHANGED: 11,
        },
        R = { UNKNOWN: 0, OPER: 1 },
        T = { UNKNOWN: 0, DELETE: 1, DELETE_EVERYWHERE: 2 },
        D = { UNREAD: 0, DELIVERED: 1, READ: 2 },
        M = (e) => {
          if (e instanceof f.a) return e.toString();
          const { low: t, high: n, unsigned: r = !0 } = e;
          if (void 0 !== t && void 0 !== n) {
            return new f.a(t, n, r).toString();
          }
          const o = typeof e;
          if ("boolean" === o || "string" === o || "number" === o) return e;
          if (Array.isArray(e)) {
            const t = [];
            return (
              e.forEach((e) => {
                void 0 !== e && t.push(M(e));
              }),
              t
            );
          }
          const i = {};
          return (
            Object.keys(e).forEach((t) => {
              void 0 !== e[t] && (i[t] = M(e[t]));
            }),
            i
          );
        },
        C = (e) => {
          const { low: t, high: n, unsigned: r } = e;
          if (void 0 !== t && void 0 !== n) {
            return new f.a(t, n, r);
          }
          const o = typeof e;
          if ("boolean" === o || "string" === o || "number" === o) return e;
          if (Array.isArray(e)) {
            const t = [];
            return (
              e.forEach((e) => {
                t.push(C(e));
              }),
              t
            );
          }
          const i = {};
          return (
            Object.keys(e).forEach((t) => {
              i[t] = C(e[t]);
            }),
            i
          );
        },
        U = (e = 0) => {
          if ("string" == typeof e) return e - 0;
          if ("number" == typeof e) return e;
          const { low: t, high: n, unsigned: r = !0 } = e;
          return void 0 !== t && "undefined" !== n
            ? new f.a(t, n, r).toNumber()
            : void 0;
        },
        x = (e) => {
          if ("string" == typeof e) return f.a.fromString(e);
          const { low: t, high: n, unsigned: r = !0 } = e;
          return void 0 !== t && "undefined" !== n
            ? new f.a(t, n, r)
            : "number" == typeof e
            ? f.a.fromNumber(e)
            : new f.a();
        },
        G = (e) =>
          void 0 === e
            ? ""
            : "string" == typeof e
            ? e
            : "number" == typeof e
            ? e + ""
            : void 0 !== e.low && void 0 !== e.high
            ? new f.a(e.low, e.high, !0).toString()
            : new f.a(e).toString(),
        L = (e) => {
          if (!e.payload) return e;
          const {
              payload: t,
              from: n = {},
              to: r = {},
              id: o = {},
              status: i,
              timestamp: s,
            } = e,
            {
              content: a = "",
              attachment: u = "",
              ctype: c = 0,
              ext: d,
              config: l,
              type: p,
            } = t;
          let f = null,
            h = null;
          try {
            f = JSON.parse(u);
          } catch (e) {}
          try {
            h = JSON.parse(l);
          } catch (e) {}
          let g = i || t.status,
            y = {
              id: G(o),
              from: G(n.uid),
              to: G(r.uid),
              content: a,
              type: Object.keys(A)[c].toLowerCase(),
              ext: d,
              status: g || D.UNREAD,
              timestamp: G(s || 0),
              toType: 2 == p ? "roster" : "group",
            };
          return f && (y.attach = f), h && (y.config = h), y;
        },
        P = () => {
          let e = wx.getStorageSync("key_user_id");
          if (e) return e - 0;
        },
        B = (e) => e % 31,
        j = (e, t, n = !0, r = -1) => {
          if (void 0 === t || void 0 === e)
            return void l.error("localstorage save error:", e, t);
          var o = e;
          if (n) {
            o = P() + "_" + e;
          }
          if ((r >= 0 && (o = o + "_" + B(r)), "string" == typeof t))
            return void wx.setStorageSync(o, t);
          let i;
          i = Array.isArray(t) ? { data: t } : t;
          try {
            const e = JSON.stringify(i);
            e && wx.setStorageSync(o, e);
          } catch (e) {
            l.error("stringify error:", e, o, t);
          }
        },
        F = (e, t = !0, n = -1) => {
          if (void 0 === e) return void l.error("localstorage get error:", e);
          var r = e;
          if (t) {
            r = P() + "_" + e;
          }
          n >= 0 && (r = r + "_" + B(n));
          const o = wx.getStorageSync(r);
          if (!o) return;
          let i = o;
          try {
            i = JSON.parse(o);
          } catch (e) {}
          return (i = C(i)), i.data || i;
        },
        V = (e, t = !0, n = -1) => {
          let r = e;
          if (t) {
            r = P() + "_" + e;
          }
          n >= 0 && (r = r + "_" + B(n)), wx.removeStorageSync(r);
        },
        q = (e, t = !0) => {
          var n;
          for (n = 0; n < 31; n++) V(e, t, n);
          V(e, t);
        },
        J = {
          saveJoinedGroups: (e) => {
            if (!e) return;
            Array.isArray(e) || (e = [e]);
            const t = e.map((e) => e.group_id || e),
              n = F("key_group_lists") || [],
              r = Array.from(new Set(t.concat(n)));
            j("key_group_lists", r);
          },
          removeGroup: (e) => {
            const t = F("key_group_lists") || [],
              n = t.findIndex((t) => t === e);
            n >= 0 && (t.splice(n, 1), j("key_group_lists", t));
          },
          getJoinedGroups: () => F("key_group_lists"),
          saveGroupInfo: (e) => {
            Array.isArray(e) || (e = [e]);
            const t = F("key_group_infos") || {};
            e.forEach((e) => {
              const n = {},
                { group_id: r } = e;
              Object.keys(e).forEach((t) => {
                void 0 !== e[t] && (n[t] = e[t]);
              }),
                (t[r] = t[r] || {}),
                Object.assign(t[r], n);
            }),
              j("key_group_infos", t);
          },
          getGroupInfo: (e) => {
            const t = F("key_group_infos")[e] || {};
            return Object.assign(t, { group_id: e });
          },
          getGroupInfoList: () => {
            const e = J.getJoinedGroups() || [],
              t = J.getAllGroupInfos() || {},
              n = [];
            return (
              e.forEach((e) => {
                const r = t[e] || {};
                n.push(Object.assign({}, r, { group_id: e }));
              }),
              n
            );
          },
          getAllGroupInfos: () => F("key_group_infos") || {},
          saveGroupMembers: (e, t, n) => {
            Array.isArray(t) || (t = [t]);
            const r = F("key_group_members") || {},
              o = r[e] || [];
            if (n) return (r[e] = t), void j("key_group_members", r);
            t.forEach((e) => {
              o.findIndex((t) => t === e) < 0 && o.push(e);
            }),
              (r[e] = o);
          },
          removeGroupMembers: (e, t) => {
            const n = (F("key_group_members") || {})[e] || [];
            t.forEach((e) => {
              const t = n.findIndex((t) => t === e);
              t >= 0 && n.splice(t, 1);
            }),
              j("key_group_members", n);
          },
          getGroupMembers: (e) => (F("key_group_members") || {})[e] || [],
          clear: () => {
            V("key_group_infos"), V("key_group_members"), V("key_group_lists");
          },
        };
      var K = J;
      const Y = () => {
          let e = F("key_user_id", !1);
          if (e) return e - 0;
        },
        W = () => {
          V("key_user_id");
        },
        H = () => {
          V("key_user_token");
        },
        Z = () => {
          V("key_user_aes_key");
        },
        X = () => {
          V("key_user_device_sn");
        },
        $ = () => {
          V("key_user_device_guid");
        };
      var z = {
        saveToken: (e) => j("key_user_token", e),
        getToken: () => F("key_user_token"),
        deleteToken: H,
        getAesKey: () => F("key_user_aes_key"),
        saveAesKey: (e) => j("key_user_aes_key", e),
        deleteAesKey: Z,
        saveDeviceSN: (e) => j("key_user_device_sn", e),
        getDeviceSN: () => {
          let e = F("key_user_device_sn");
          return (
            e || (e = 999999999 + Math.floor(214e4 * Math.random()) + ""), e - 0
          );
        },
        deleteDeviceSN: X,
        saveUid: (e) => {
          if (!e)
            throw (l.error("uid error:", e), new Error("uid is error ..."));
          j("key_user_id", e + "", !1);
        },
        getUid: Y,
        removeUid: W,
        getDeviceGuid: () => {
          if (!Y()) return "";
          let e = F("key_user_device_guid");
          return (
            e ||
              ((e = Y() + "_" + Math.floor(2147483648 * Math.random())),
              j("key_user_device_guid", e)),
            e
          );
        },
        deleteDeviceGuid: $,
        saveProfile: (e) => j("key_user_profile", e),
        getProfile: () => F("key_user_profile"),
        clear: () => {
          X(), Z(), H(), W(), $();
        },
        saveAppid: (e) => {
          if (!e)
            throw (
              (l.error("Invalid appid :", e), new Error("Invalid appid ..."))
            );
          j("key_app_id", e + "", !1);
        },
        getAppid: () => F("key_app_id", !1),
      };
      const Q = {},
        ee = (e) => (void 0 === Q[e] && (Q[e] = []), Q[e]),
        te = (e, t) => {
          const n = ee(e).findIndex((e) => e.toString() === t.toString());
          n > -1 && ee(e).splice(n, 1), ee(e).push(t);
        },
        ne = (e, t) => {
          const n = ee(e).findIndex((e) => e.toString() === t.toString());
          n >= 0 && Q[e].splice(n, 1);
        },
        re = (e, t) => {
          ee(e).forEach((e) => {
            e(t);
          });
        },
        oe = {
          saveRecent: (e) => {
            if (
              ((e) => {
                const { ext: t } = e;
                let n = {};
                try {
                  n = JSON.parse(t);
                } catch (e) {}
                if (void 0 !== n.input_status) {
                  n.input_status;
                  return !0;
                }
                return !1;
              })(e)
            )
              return;
            const {
              from: t,
              to: n,
              type: r,
              toType: o,
              attach: i,
              ext: s,
              timestamp: a,
            } = e;
            let u = e.content;
            if (!u && !i)
              return void (
                s &&
                s.typing &&
                re("onInputStatusMessage", { from: t, to: n, ext: s })
              );
            "text" != r && (u = r);
            let c = U(n);
            const d = z.getUid();
            c === d && (c = U(t));
            const l = F("key_recent_store") || [],
              p = l.findIndex((e) => e.type === o && e.id === c);
            p > -1 && l.splice(p, 1),
              l.unshift({ type: o, id: c, content: u, ext: s, timestamp: a }),
              j("key_recent_store", l),
              re("recentlistUpdate");
          },
          saveUnreadRecent: (e, t) => {
            e.forEach((e) => {
              const n = t,
                r = F("key_recent_store") || [];
              let o = "",
                i = "";
              const s = r.findIndex((t) => t.type === n && t.id === e);
              s > -1 &&
                ((o = r[s].content), (i = r[s].timestamp), r.splice(s, 1)),
                r.unshift({ type: n, id: e, content: o, timestamp: i }),
                j("key_recent_store", r);
            }),
              re("recentlistUpdate");
          },
          getRecents: () => {
            const e = F("key_recent_store") || [],
              t = e.filter((e) => "roster" == e.type).map((e) => e.id);
            return re("imGetRecent", t), e;
          },
          getRecentById: (e) => {
            const t = F("key_recent_store") || [],
              n = t.findIndex((t) => t.id + "" == e + "");
            if (n < 0) return { idx: n };
            const r = t[n].type;
            return { idx: n, id: e, type: r };
          },
          deleteRecentById(e) {
            const { idx: t } = oe.getRecentById(e);
            if (t < 0) return;
            const n = F("key_recent_store") || [];
            n.splice(t, 1), j("key_recent_store", n);
          },
          clear: () => {
            V("key_recent_store");
          },
        };
      var ie = oe;
      const se = (e) => {
          const { payload: t } = e;
          if (!t) return !1;
          const { type: n, operation: r = {} } = t;
          if (!r || n !== N.OPER) return !1;
          const { type: o } = r;
          return o === b.READ_ACK || o == b.READ_ALL;
        },
        ae = (e, t) => {
          const n = x(t.id);
          if (0 === e.length) e.push(t);
          else {
            const r = e[0],
              o = e[e.length - 1];
            if (-1 === n.comp(x(r.id))) e.unshift(t);
            else if (1 === n.comp(x(o.id))) e.push(t);
            else {
              let r = 0,
                o = 0;
              for (; r < e.length; ) {
                const t = e[r],
                  i = n.comp(x(t.id));
                if ((0 === i && (o = 1), 1 !== i)) break;
                r++;
              }
              e.splice(r, o, t);
            }
          }
          return e;
        },
        ue = {
          saveSendingRosterMessage: (e) => {
            const t = F("key_roster_sending_message") || [];
            t.push(e);
            const n = t.length;
            n > 100 && t.splice(0, n - 100), j("key_roster_sending_message", t);
            const { to: r, id: o } = e;
            re("onSendingMessageStatusChanged", {
              status: "sending",
              uid: r.uid,
              mid: o,
            });
          },
          dealSendedRosterMessage: (e) => {
            const { client_mid: t, server_mid: n } = e,
              r = F("key_roster_sending_message") || [];
            if (!n) {
              l.log(
                "===================== there is something error:=============="
              ),
                l.log(e);
              const n = r.findIndex((e) => U(e.id) === U(t));
              if (n > -1) {
                (F("key_roster_sending_message") || []).splice(n, 1);
              }
              return;
            }
            const o = r.findIndex((e) => U(e.id) === U(t));
            if (o > -1) {
              const e = r[o];
              e.id = n;
              const i = L(e);
              (i.status = D.UNREAD),
                ue.saveRosterMessage(i),
                (i.toType = "roster"),
                ie.saveRecent(i),
                r.splice(o, 1),
                j("key_roster_sending_message", r),
                re("onRosterMessage", i),
                se(i) ||
                  re("onSendingMessageStatusChanged", {
                    status: "sent",
                    mid: U(t),
                  });
            }
          },
          saveRosterMessage: (e) => {
            const { from: t, to: n, type: r } = e;
            if ("command" == r || "forward" == r) return;
            const o = U(t),
              i = U(z.getUid()),
              s = U(n);
            let a = o === i ? s : o;
            const u = F("key_roster_message_store", !0, a) || {},
              c = u[a] || [];
            ae(c, e),
              c.length > 100 ? (u[a] = c.slice(c.length - 100)) : (u[a] = c),
              j("key_roster_message_store", u, !0, a);
          },
          getRosterMessage: (e) =>
            (F("key_roster_message_store", !0, e) || {})[e] || [],
          saveFormatedRosterMessage: (e, t = []) => {
            const n = F("key_roster_message_store", !0, e) || {};
            (n[e] = t), j("key_roster_message_store", n, !0, e);
          },
          getRosterUnreadMessageIdsByRosterid: (e) => {
            const t = (F("key_roster_message_store", !0, e) || {})[e] || [],
              n = [];
            return (
              t.forEach((e) => {
                const { status: t = D.READ, id: r } = e;
                t == D.UNREAD && n.push(r);
              }),
              n
            );
          },
          deleteRosterMessageByRosterId: (e) => {
            const t = F("key_roster_message_store", !0, e) || {};
            t[e] && delete t[e], j("key_roster_message_store", t, !0, e);
          },
          deleteSingleRosterMessage: (e, t) => {
            const n = F("key_roster_message_store", !0, e) || {},
              r = G(t),
              o = n[e] || [],
              i = o.findIndex((e) => G(e.id) === r);
            i > -1 &&
              (o.splice(i, 1),
              (n[e] = o),
              j("key_roster_message_store", n, !0, e));
          },
          saveSendingGroupMessage: (e) => {
            const t = F("key_group_sending_message") || [];
            t.push(e);
            const n = t.length;
            n > 100 && t.splice(0, n - 100), j("key_group_sending_message", t);
            const { to: r, id: o } = e;
            re("onSendingMessageStatusChanged", {
              status: "sending",
              uid: r.uid,
              mid: o,
            });
          },
          dealSendedGroupMessage: (e) => {
            const { client_mid: t, server_mid: n } = e,
              r = F("key_group_sending_message") || [],
              o = r.findIndex((e) => U(e.id) === U(t));
            if (o > -1) {
              const e = r[o];
              e.id = n;
              const i = L(e);
              (i.status = D.UNREAD),
                ue.saveGroupMessage(i),
                (i.toType = "group"),
                ie.saveRecent(i),
                r.splice(o, 1),
                j("key_group_sending_message", r),
                re("onGroupMessage", i),
                se(i) ||
                  re("onSendingMessageStatusChanged", {
                    status: "sent",
                    mid: U(t),
                  });
            }
          },
          saveGroupMessage: (e) => {
            const { to: t, type: n } = e;
            if ("command" == n || "forward" == n) return;
            const r = U(t),
              o = F("key_group_message_store", !0, r) || {},
              i = o[r] || [];
            ae(i, e),
              i.length > 100 ? (o[r] = i.slice(i.length - 100)) : (o[r] = i),
              j("key_group_message_store", o, !0, r);
          },
          getGroupMessage: (e) =>
            (F("key_group_message_store", !0, e) || {})[e] || [],
          saveFormatedGroupMessage: (e, t = []) => {
            const n = F("key_group_message_store", !0, e) || {};
            (n[e] = t), j("key_group_message_store", n, !0, e);
          },
          getGroupUnreadMessageIdsByGid: (e) => {
            const t = (F("key_group_message_store", !0, e) || {})[e] || [],
              n = [];
            return (
              t.forEach((e) => {
                const { r: t = !1, id: r } = e;
                !t && n.push(r);
              }),
              n
            );
          },
          deleteGroupMessageByGid: (e) => {
            const t = F("key_group_message_store", !0, e) || {};
            t[e] && delete t[e], j("key_group_message_store", t, !0, e);
          },
          deleteSingleGroupMessage: (e, t) => {
            const n = F("key_group_message_store", !0, e) || {};
            t = G(t);
            const r = n[e] || [],
              o = r.findIndex((e) => G(e.id) === t);
            o > -1 &&
              (r.splice(o, 1),
              (n[e] = r),
              j("key_group_message_store", n, !0, e));
          },
          getUnreadByRosterId: (e) => {
            const t = ue.getRosterMessage(e) || [];
            let n = 0;
            const r = z.getUid();
            return (
              t.forEach((e) => {
                const { from: t, status: o } = e,
                  i = U(t);
                i > 0 && i !== r && o != D.READ && n++;
              }),
              n
            );
          },
          getUnreadByGroupId: (e) => {
            const t = ue.getGroupMessage(e) || [];
            let n = 0;
            const r = z.getUid();
            return (
              t.forEach((e) => {
                const { from: t, status: o } = e,
                  i = U(t);
                i > 0 && i !== r && o != D.READ && n++;
              }),
              n
            );
          },
          getRosterMessageById: (e, t) => {
            const n = F("key_roster_message_store", !0, e) || {};
            for (var r in n) {
              const e = n[r];
              if (e && e.length) {
                const n = e.find((e) => e.id == t);
                if (n) return n;
              }
            }
          },
          getGroupMessageById: (e, t) => {
            const n = F("key_group_message_store", !0, e) || {};
            for (var r in n) {
              const e = n[r];
              if (e && e.length) {
                const n = e.find((e) => e.id == t);
                if (n) return n;
              }
            }
          },
          clear: (e, t) => {
            "group" == t
              ? ue.deleteGroupMessageByGid(e)
              : ue.deleteRosterMessageByRosterId(e);
          },
          clearAll: () => {
            q("key_roster_message_store"),
              q("key_group_message_store"),
              V("key_group_sending_message"),
              V("key_roster_sending_message");
          },
        };
      var ce = ue;
      var de = {
        saveNotice: () => {},
        getNotice: () => F("key_notice_store") || [],
        removeNotice: () => {},
      };
      const le = {
        saveRosterList: (e = []) => {
          Array.isArray(e) || (e = [e]);
          const t = e.map((e) => e.roster_user_id || e.user_id || e),
            n = le.getRosterList() || [];
          let r;
          (r = Array.isArray(n) ? Array.from(new Set(n.concat(t))) : t),
            j("key_roster_lists", r),
            le.saveRosterInfo(e);
        },
        getRosterList: () => F("key_roster_lists"),
        getRosterInfoList: () => {
          const e = le.getRosterList() || [],
            t = le.getAllRosterInfos() || {},
            n = [];
          return (
            e.forEach((e) => {
              const r = t[e] || {};
              n.push(Object.assign({}, r, { user_id: e }));
            }),
            n
          );
        },
        removeRoster: (e) => {
          const t = le.getRosterList(),
            n = t.indexOf(e);
          n >= 0 && t.splice(n, 1), j("key_roster_lists", t);
        },
        removeRosterList: () => V("key_roster_lists"),
        saveRosterInfo: (e = []) => {
          Array.isArray(e) || (e = [e]);
          const t = le.getAllRosterInfos() || {};
          e.forEach((e) => {
            const { user_id: n } = e,
              r = {};
            Object.keys(e).forEach((t) => {
              const n = e[t];
              void 0 !== n && (r[t] = n);
            }),
              n && ((t[n] = t[n] || {}), Object.assign(t[n], r));
          }),
            j("key_roster_infos", t);
        },
        getRosterInfo: (e) => {
          let t = (F("key_roster_infos") || {})[e] || { user_id: e };
          return t && Object.assign(t, { user_id: e });
        },
        getAllRosterInfos: () => F("key_roster_infos"),
        clear: () => {
          V("key_roster_infos"), V("key_roster_lists");
        },
      };
      var pe = le,
        fe = n(14),
        he = n.n(fe);
      let ge = { errTimer: null, errCount: 0 },
        ye = "";
      te("refresh_ratel", (e) => {
        e && (ye = e);
      });
      const me = [
          "app_dns",
          "app/captcha/image",
          "app/captcha/sms",
          "app/captcha/sms_web",
          "app/user/info_pwd",
          "app/wechat_login",
          "mobile_bind_with_sign",
          "qr_code",
          "qr_login",
          "token/id",
          "token/user",
          "user/register",
        ],
        ve = (e) => {
          const t = z.getToken(),
            n = z.getAppid();
          if (
            ((e) => {
              let t = !0;
              return (
                me.forEach((n) => {
                  e.indexOf(n) > -1 && (t = !1);
                }),
                t
              );
            })(e) &&
            !t
          )
            throw (
              (re("flooNotice", { category: "action", desc: "relogin" }),
              new Error("you should login ..."))
            );
          return { "access-token": t, app_id: n };
        },
        _e = (e, t = "get", n = {}, r = [], o = !1, i = {}) => {
          l.log("========request=============", e, t, n, r, o);
          const s = ((e = {}, t = []) => {
            let n = [];
            return (
              t.forEach((t) => {
                if (
                  ("string" == typeof t &&
                    void 0 === e[t] &&
                    n.push(t + " can not be null.."),
                  Array.isArray(t))
                ) {
                  let r = !1;
                  t.forEach((t) => {
                    void 0 !== e[t] && (r = !0);
                  }),
                    r || n.push(t.join("、") + " can not be all null");
                }
              }),
              n
            );
          })(n, r);
          if (s.length) {
            const e = s.join(",");
            return Promise.reject(new Error(e));
          }
          let a = {};
          const u = t.toLowerCase();
          var c;
          "get" === u || ("post" === u && o)
            ? (e.indexOf("?") > 0 ? (e += "&") : (e += "?"),
              (e += he.a.stringify(n)))
            : ((c = n).group_id && (c.group_id = c.group_id - 0),
              c.user_id && (c.user_id = c.user_id - 0),
              c.new_owner && (c.new_owner = c.new_owner - 0),
              c.apply_approval && (c.apply_approval = c.apply_approval - 0),
              c.duration && (c.duration = c.duration - 0),
              c.limit && (c.limit = c.limit - 0),
              c.version && (c.version = c.version - 0),
              c.announcement_id && (c.announcement_id = c.announcement_id - 0),
              c.user_list &&
                Array.isArray(c.user_list) &&
                (c.user_list = c.user_list.map((e) => e - 0)),
              c.user_list &&
                Array.isArray(c.user_list) &&
                (c.user_list = c.user_list.map((e) => e - 0)),
              c.file_list &&
                Array.isArray(c.file_list) &&
                (c.file_list = c.file_list.map((e) => e - 0)),
              (a = c));
          let d = i.headers || ve(e);
          if (
            (e.indexOf("http") < 0 && (e = ye + e),
            i.operation && "upload_file" === i.operation)
          )
            return new Promise((t, r) => {
              const o = {
                url: e,
                header: d,
                filePath: n.filePath,
                formData: n.formData,
                name: n.name,
                success: function (e) {
                  Ee(),
                    200 === e.statusCode
                      ? (console.log("Upload file success: ", e),
                        t(e.tempFilePath))
                      : (console.error("Upload file error: ", e), r(e));
                },
                fail: function (e) {
                  Ne(), r(e);
                },
              };
              wx.uploadFile(o);
            });
          if (i.operation && "download_file" === i.operation)
            return new Promise((t, n) => {
              const r = {
                url: e,
                header: d,
                success: function (e) {
                  Ee(),
                    200 === e.statusCode
                      ? (console.log("Download file success: ", e),
                        t(e.tempFilePath))
                      : (console.error("Download file error: ", e), n(e));
                },
                fail: function (e) {
                  Ne(), n(e);
                },
              };
              wx.downloadFile(r);
            });
          let p = i.content_type || "application/json";
          return (
            (d = Object.assign(d, { "Content-Type": p })),
            new Promise((n, r) => {
              const o = {
                url: e,
                data: a,
                header: d,
                method: t,
                dataType: "json",
                success: function (t) {
                  Ee();
                  const { data: o = {} } = t;
                  if (i.headers && 0 !== Object.keys(i.headers).length) {
                    if ("boolean" == typeof o.data && o.data) return;
                    if ("string" == typeof o.Status && "OK" === o.Status)
                      return;
                    return (
                      console.log("====== request got unkonwn response, ", t),
                      Promise.reject({ config: i, url: e })
                    );
                  }
                  const { data: s, code: a, message: u } = o;
                  200 === a
                    ? (l.log("======request success, ", e, s), n(s))
                    : (402 === a &&
                        re("flooNotice", {
                          category: "action",
                          desc: "relogin",
                        }),
                      l.req(e + "" == "" + u),
                      r({ message: u, url: e, data: o }));
                },
                fail: function (e) {
                  Ne(), r(e);
                },
                complete: function () {},
              };
              wx.request(o);
            })
          );
        };
      function Ee() {
        ge.errTimer && clearTimeout(ge.errTimer),
          (ge.errTimer = null),
          (ge.errCount = 0);
      }
      function Ne() {
        ge.errTimer && clearTimeout(ge.errTimer),
          (ge.errTimer = null),
          (ge.errCount = ge.errCount + 1),
          ge.errCount >= 5
            ? ((ge.errCount = 0), re("ratelError"))
            : (ge.errTimer = setTimeout(() => {
                ge.errCount = 0;
              }, 18e5));
      }
      const be = (e, t) => _e(e, "get", t, ["app_id"], !0),
        Ae = (e) =>
          _e("/token/user", "post", e, [["mobile", "name"], "password"]),
        we = (e) => _e("/token/id", "post", e, ["user_id", "password"]),
        Oe = (e) =>
          _e("/user/register/v2", "post", e, ["username", "password"]),
        Se = (e) =>
          _e("/app/user/mobile_bind", "post", e, ["captcha", "mobile"]),
        Ie = (e) => _e("/app/user/mobile_update", "post", e, ["mobile"]),
        ke = (e) => _e("/app/captcha/sms", "get", e, ["mobile"], !0),
        Re = (e) => _e("/app/user/name_check", "get", e, ["username"], !0),
        Te = (e) =>
          _e("/app/user/mobile_bind", "post", e, ["captcha", "mobile"]),
        De = (e) =>
          _e("/app/user/mobile_bind_with_sign", "post", e, ["sign", "mobile"]),
        Me = (e) =>
          _e("/app/user/info_pwd", "get", e, ["captcha", "mobile"], !0),
        Ce = (e) => _e("/app/captcha/image", "post", e, []),
        Ue = (e) =>
          _e(
            "/app/captcha/sms_web",
            "get",
            e,
            ["captcha", "image_id", "mobile"],
            !0
          ),
        xe = (e) => _e("/roster/accept", "post", e, ["user_id"], !0),
        Ge = (e) => _e("/roster/apply", "post", e, ["user_id", "alias"]),
        Le = (e) => _e("/roster/decline", "post", e, ["user_id"]),
        Pe = (e) => _e("/roster/delete", "post", e, ["user_id"], !0),
        Be = (e) => _e("/roster/ext", "post", e, ["user_id", "ext"]),
        je = (e) => _e("/roster/id", "get", e, ["user_id"]),
        Fe = (e) => _e("/roster/list", "get", e, []),
        Ve = (e) => _e("/roster/list", "post", e, ["list"]),
        qe = (e) => _e("/roster/name", "get", e, ["username"]),
        Je = (e) => _e("/roster/apply/list", "get", e, ["cursor"], !0),
        Ke = (e) => _e("/roster/blocked_list", "get", e, [""], !0),
        Ye = (e) => _e("/roster/block", "post", e, ["user_id"], !0),
        We = (e) => _e("/roster/unblock", "post", e, ["user_id"], !0),
        He = (e) =>
          _e("/group/admin/add", "post", e, ["group_id", "user_list"]),
        Ze = (e) => _e("/group/admin_list", "get", e, ["group_id"], !0),
        Xe = (e) =>
          _e("/group/admin/remove", "post", e, ["group_id", "user_list"]),
        $e = (e) =>
          _e("/group/announcement", "get", e, ["announcement_id", "group_id"]),
        ze = (e) =>
          _e(
            "/group/announcement/delete",
            "post",
            e,
            ["announcement_id", "group_id"],
            !0
          ),
        Qe = (e) =>
          _e("/group/announcement/edit", "post", e, [
            "group_id",
            "content",
            "title",
          ]),
        et = (e) => _e("/group/announcement/list", "get", e, ["group_id"], !0),
        tt = (e) => _e("/group/create", "post", e, ["name"]),
        nt = (e) => _e("/group/destroy", "post", e, ["group_id"], !0),
        rt = (e) => _e("/group/info", "get", e, ["group_id"]),
        ot = (e) => _e("/group/info/avatar", "post", e, ["group_id", "value"]),
        it = (e) =>
          _e("/group/info/description", "post", e, ["group_id", "value"]),
        st = (e) => _e("/group/info/ext", "post", e, ["group_id", "value"]),
        at = (e) => _e("/group/info/name", "post", e, ["group_id", "value"]),
        ut = (e) => _e("/group/member_list", "get", e, ["group_id"]),
        ct = (e) =>
          _e("/group/msg/mute_mode", "post", e, ["group_id", "msg_mute_mode"]),
        dt = (e) =>
          _e("/group/msg/not_disturb", "post", e, ["group_id", "value"]),
        lt = () => _e("/group/public_list", "get", {}, []),
        pt = (e) => _e("/group/banned_list", "get", e, ["group_id"]),
        ft = (e) =>
          _e("/group/ban", "post", e, ["group_id", "duration", "user_list"]),
        ht = (e) => _e("/group/unban", "post", e, ["group_id", "user_list"]),
        gt = (e) => _e("/group/settings", "get", e, ["group_id"]),
        yt = (e) =>
          _e("/group/settings/allow_member_invitation", "post", e, [
            "group_id",
            "value",
          ]),
        mt = (e) =>
          _e("/group/settings/allow_member_modify", "post", e, [
            "group_id",
            "value",
          ]),
        vt = (e) =>
          _e("/group/settings/enable_read_ack", "post", e, [
            "group_id",
            "value",
          ]),
        _t = (e) =>
          _e("/group/settings/history_visible", "post", e, [
            "group_id",
            "value",
          ]),
        Et = (e) =>
          _e("/group/settings/require_admin_approval", "post", e, [
            "group_id",
            "apply_approval",
          ]),
        Nt = (e) =>
          _e("/group/settings/ban_all", "post", e, ["group_id", "duration"]),
        bt = (e) => _e("/group/settings/unban_all", "post", e, ["group_id"]),
        At = (e) => _e("/group/transfer", "post", e, ["group_id", "new_owner"]),
        wt = (e) => _e("/group/user_joined", "get", e),
        Ot = (e) => _e("/group/apply", "post", e, ["group_id"]),
        St = (e) =>
          _e("/group/apply/handle", "post", e, [
            "approval",
            "group_id",
            "user_id",
          ]),
        It = (e) => _e("/group/blocked_list", "get", e, ["group_id"]),
        kt = (e) => _e("/group/block", "post", e, ["user_list", "group_id"]),
        Rt = (e) => _e("/group/unblock", "post", e, ["user_list", "group_id"]),
        Tt = (e) => _e("/group/kick", "post", e, ["user_list", "group_id"]),
        Dt = (e) => _e("/group/invite", "post", e, ["user_list", "group_id"]),
        Mt = (e) =>
          _e("/group/invite/handle", "post", e, [
            "approval",
            "user_id",
            "group_id",
          ]),
        Ct = (e) => _e("/group/info/batch", "post", e, ["group_list"]),
        Ut = (e) =>
          _e("/group/members/display_name", "post", e, [
            "group_id",
            "user_list",
          ]),
        xt = (e) => _e("/group/leave", "post", e, ["group_id"], !0),
        Gt = (e) => _e("/group/display_name", "post", e, ["group_id", "value"]),
        Lt = (e) => _e("/group/application_list", "post", e, ["group_list"]),
        Pt = () => _e("/group/invitation_list", "get", {}, []),
        Bt = (e) => _e("/group/file/list", "get", e, ["group_id"], !0),
        jt = (e) =>
          _e("/group/file/delete", "post", e, ["file_list", "group_id"]),
        Ft = (e) =>
          _e("/group/file/upload", "post", e, [
            "name",
            "size",
            "url",
            "group_id",
          ]),
        Vt = (e) => _e("/user/authmode", "post", e, ["value"], !0),
        qt = (e) => _e("/user/avatar", "post", e, ["avatar"]),
        Jt = (e) => _e("/user/mobile", "post", e, ["mobile"], !0),
        Kt = (e) => _e("/user/nickname", "post", e, ["nick_name"], !0),
        Yt = () => _e("/user/profile", "get", {}, []),
        Wt = (e) => _e("/user/profile", "post", e, []),
        Ht = (e) => _e("/user/push", "post", e, ["value"]),
        Zt = (e) => _e("/user/push/detail", "post", e, ["value"]),
        Xt = (e) =>
          _e("/user/push/limit", "post", e, [
            "no_push_end_hour",
            "no_push_start_hour",
          ]),
        $t = (e) => _e("/user/push/nickname", "post", e, ["value"]),
        zt = () => _e("/user/settings", "get", {}, []),
        Qt = (e) => _e("/user/settings", "post", e, ["user_id"]),
        en = (e) => _e("/user/sounds", "post", e, ["value"]),
        tn = (e) => _e("/user/vibratory", "post", e, ["value"]),
        nn = (e) =>
          _e("/user/token/bind", "post", e, [
            "device_sn",
            "device_token",
            "notifier_name",
          ]),
        rn = (e) => _e("/user/token/unbind", "post", e, [], !0),
        on = (e) =>
          _e(
            "/file/upload/forward",
            "get",
            e,
            ["file_sign", "access-token", "to_id", "to_type"],
            !0
          ),
        sn = (e, t, n) => _e(e, "post", t, [], !1, n),
        an = (e) => _e("/file/upload/avatar/user", "get", e, [], !0),
        un = (e) => _e("/file/upload/avatar/group", "get", e, ["group_id"], !0),
        cn = (e) =>
          _e(
            "/file/upload/chat",
            "get",
            e,
            ["file_type", "to_id", "to_type"],
            !0
          ),
        dn = (e, t, n) => _e(e, "get", t, [], !0, n),
        ln = (e) => _e("/app/qr_code", "get", e, []),
        pn = (e) => _e("/app/qr_login", "get", e, ["qr_code"]),
        fn = (e) => _e("/app/qrcode/group_sign", "get", e, ["group_id"], !0),
        hn = (e) => _e("/app/qrcode/group_invite", "get", e, ["qr_info"], !0),
        gn = (e) => _e("/user/bind_openid", "get", e, ["open_id"], !0),
        yn = (e) => _e("/app/wechat_login", "get", e, ["code"], !0),
        mn = (e) => _e("/app/support_staff", "get", e, [], !0),
        vn = () => _e("/app/wechat/unbind", "post"),
        _n = () => _e("/app/wechat/is_bind", "get"),
        En = (e) => _e("/app/wechat/bind", "post", e, ["open_id", "type"]),
        Nn = function (e = {}) {
          this.uid = e.uid || 0;
          const t = void 0 === e.deviceSN ? z.getDeviceSN() : e.deviceSN;
          this.deviceSN = t;
        };
      (Nn.prototype.setUid = function (e) {
        this.uid = e;
      }),
        (Nn.prototype.setDeviceSN = function (e) {
          this.deviceSN = e;
        });
      var bn = Nn;
      function An(e) {
        const { operation: t = { type: b.UNKNOWN, mid: 0 } } = e;
        void 0 !==
          (e = Object.assign(
            {},
            { type: N.NORMAL, ctype: A.TEXT, content: "", operation: t },
            e
          )).type && (this.type = e.type),
          void 0 !== e.from && (this.from = e.from),
          void 0 !== e.to && (this.to = e.to),
          void 0 !== e.content && (this.content = e.content),
          void 0 !== e.ctype && (this.ctype = e.ctype),
          void 0 !== e.operation && (this.operation = e.operation),
          void 0 !== e.config && (this.config = e.config),
          void 0 !== e.attachment && (this.attachment = e.attachment),
          void 0 !== e.ext && (this.ext = e.ext),
          void 0 !== e.qos && (this.qos = e.qos),
          void 0 !== e.sender_name && (this.sender_name = e.sender_name),
          void 0 !== e.is_system && (this.is_system = e.is_system),
          void 0 !== e.priority && (this.priority = e.priority);
      }
      An.prototype = {
        setType: function (e) {
          this.type = e;
        },
        setFrom: function (e) {
          this.from = e;
        },
        setTo: function (e) {
          this.to = e;
        },
        setContent: function (e) {
          this.content = e;
        },
        setCtype: function (e) {
          this.ctype = e;
        },
        setOperation: function (e) {
          this.operation = e;
        },
        setConfig: function (e) {
          this.config = e;
        },
        setAttachment: function (e) {
          this.attachment = e;
        },
        setExt: function (e) {
          this.ext = e;
        },
        setQos: function (e) {
          this.qos = e;
        },
        setSendername: function (e) {
          this.sender_name = e;
        },
        setIssystem: function (e) {
          this.is_system = e;
        },
        setPriority: function (e) {
          this.priority = e;
        },
      };
      var wn = An;
      function On(e) {
        void 0 !==
          (e = Object.assign(
            {},
            { vsn: h.XSYNC_V1, compress_method: y.NONE },
            e
          )).vsn && (this.vsn = e.vsn),
          void 0 !== e.compress_method &&
            (this.compress_method = e.compress_method),
          void 0 !== e.command && (this.command = e.command),
          void 0 !== e.payload && (this.payload = e.payload),
          void 0 !== e.encrypt_method &&
            (this.encrypt_method = e.encrypt_method),
          void 0 !== e.encrypt_key && (this.encrypt_key = e.encrypt_key),
          void 0 !== e.check_sum && (this.check_sum = e.check_sum),
          void 0 !== e.tag && (this.tag = e.tag);
      }
      On.prototype = {
        setVsn: function (e) {
          this.vsn = e;
        },
        setCompressmethod: function (e) {
          this.compress_method = e;
        },
        setCommond: function (e) {
          this.command = e;
        },
        setPayload: function (e) {
          this.payload = e;
        },
        setEncryptmethod: function (e) {
          this.encrypt_method = e;
        },
        setEncryptkey: function (e) {
          this.encrypt_key = e;
        },
        setChecksum: function (e) {
          this.check_sum = e;
        },
        setTag: function (e) {
          this.tag = e;
        },
      };
      var Sn = On;
      function In(e) {
        void 0 !==
          (e = Object.assign(
            {},
            { encrypt_method: _.ENCRYPT_NONE, os_type: v.WEB },
            e
          )).status && (this.status = e.status),
          void 0 !== e.xid && (this.xid = e.xid),
          void 0 !== e.encrypt_method &&
            (this.encrypt_method = e.encrypt_method),
          void 0 !== e.encrypt_key && (this.encrypt_key = e.encrypt_key),
          void 0 !== e.password && (this.password = e.password),
          void 0 !== e.token && (this.token = e.token),
          void 0 !== e.os_type && (this.os_type = e.os_type),
          void 0 !== e.sdk_vsn && (this.sdk_vsn = e.sdk_vsn),
          void 0 !== e.is_manual_login &&
            (this.is_manual_login = e.is_manual_login),
          void 0 !== e.device_guid && (this.device_guid = e.device_guid),
          void 0 !== e.device_notifier &&
            (this.device_notifier = e.device_notifier),
          void 0 !== e.device_token && (this.device_token = e.device_token),
          void 0 !== e.device_info && (this.device_info = e.device_info),
          void 0 !== e.last_login_time &&
            (this.last_login_time = e.last_login_time);
      }
      In.prototype = {
        setStatus: function (e) {
          this.status = e;
        },
        setXid: function (e) {
          this.xid = e;
        },
        setEncryptmethod: function (e) {
          this.encrypt_method = e;
        },
        setEncryptkey: function (e) {
          this.encrypt_key = e;
        },
        setPassword: function (e) {
          this.password = e;
        },
        setToken: function (e) {
          this.token = e;
        },
        setOstype: function (e) {
          this.os_type = e;
        },
        setSdkvsn: function (e) {
          this.sdk_vsn = e;
        },
        setIsmanuallogin: function (e) {
          this.is_manual_login = e;
        },
        setDeviceguid: function (e) {
          this.device_guid = e;
        },
        setDevicenotifier: function (e) {
          this.device_notifier = e;
        },
        setDevicetoken: function (e) {
          this.device_token = e;
        },
        setDeviceinfo: function (e) {
          this.device_info = e;
        },
        setLastlogintime: function (e) {
          this.last_login_time = e;
        },
      };
      var kn = In;
      function Rn(e) {
        void 0 !== (e = Object.assign({}, e)).status &&
          (this.status = e.status),
          void 0 !== e.metas && (this.metas = e.metas),
          void 0 !== e.next_key && (this.next_key = e.next_key),
          void 0 !== e.xid && (this.xid = e.xid),
          void 0 !== e.client_mid && (this.client_mid = e.client_mid),
          void 0 !== e.server_mid && (this.server_mid = e.server_mid),
          void 0 !== e.server_time && (this.server_time = e.server_time),
          void 0 !== e.is_full_sync && (this.is_full_sync = e.is_full_sync),
          void 0 !== e.prev_mid && (this.prev_mid = e.prev_mid),
          void 0 !== e.is_eager_sync && (this.is_eager_sync = e.is_eager_sync);
      }
      Rn.prototype = {
        setStatus: function (e) {
          this.status = e;
        },
        setMetas: function (e) {
          this.metas = e;
        },
        setNextkey: function (e) {
          this.next_key = e;
        },
        setXid: function (e) {
          this.xid = e;
        },
        setClientmid: function (e) {
          this.client_mid = e;
        },
        setServermid: function (e) {
          this.server_mid = e;
        },
        setServertime: function (e) {
          this.server_time = e;
        },
        setIsfullsync: function (e) {
          this.is_full_sync = e;
        },
        setPrevmid: function (e) {
          this.prev_mid = e;
        },
        setIseagersync: function (e) {
          this.is_eager_sync = e;
        },
      };
      function Tn(e) {
        void 0 !== (e = Object.assign({}, e)).xid && (this.xid = e.xid),
          void 0 !== e.key && (this.key = e.key),
          void 0 !== e.meta && (this.meta = e.meta),
          void 0 !== e.is_full_sync && (this.is_full_sync = e.is_full_sync),
          void 0 !== e.full_sync_num && (this.full_sync_num = e.full_sync_num);
      }
      Tn.prototype = {
        setXid: function (e) {
          this.xid = e;
        },
        setKey: function (e) {
          this.key = e;
        },
        setMeta: function (e) {
          this.meta = e;
        },
        setIsfullsync: function (e) {
          this.is_full_sync = e;
        },
        setFullsyncnum: function (e) {
          this.full_sync_num = e;
        },
      };
      var Dn = Tn;
      function Mn(e) {
        void 0 !== (e = Object.assign({}, e)).id && (this.id = e.id),
          void 0 !== e.from && (this.from = e.from),
          void 0 !== e.to && (this.to = e.to),
          void 0 !== e.timestamp && (this.timestamp = e.timestamp),
          void 0 !== e.ns && (this.ns = e.ns),
          void 0 !== e.payload && (this.payload = e.payload);
      }
      Mn.prototype = {
        setId: function (e) {
          this.id = e;
        },
        setFrom: function (e) {
          this.from = e;
        },
        setTo: function (e) {
          this.to = e;
        },
        setTimestamp: function (e) {
          this.timestamp = e;
        },
        setNs: function (e) {
          this.ns = e;
        },
        setPayload: function (e) {
          this.payload = e;
        },
      };
      var Cn = Mn;
      function Un(e) {
        void 0 !== e.type && (this.type = e.type),
          void 0 !== e.operation && (this.operation = e.operation);
      }
      Un.prototype = {
        setType: function (e) {
          this.type = e;
        },
        setOperation: function (e) {
          this.operation = e;
        },
      };
      var xn = Un;
      let Gn = z.getDeviceSN(),
        Ln = z.getDeviceGuid();
      te("userKicked", () => {
        l.log("user is kicked ... will new devicesn and guid, old Guid", Ln),
          (Gn = 0),
          (Ln = 999999999 + Math.floor(214e4 * Math.random()) + ""),
          l.log("new Guid", Ln);
      }),
        te("temporary_deviceSN", (e) => {
          Gn = e;
        });
      const Pn = (e) => {
          const t = new Sn();
          t.setCommond(g.SYNC);
          const n = new Dn();
          return (
            e.xid && n.setXid(e.xid),
            e.next_key && n.setKey(e.next_key),
            t.setPayload(n),
            t
          );
        },
        Bn = (e) => {
          const {
            gid: t,
            content: n,
            type: r = "text",
            attachment: o,
            ext: i,
            priority: s,
          } = e;
          let a = Object.keys(A).indexOf(r.toUpperCase());
          const u = new bn({ uid: z.getUid() - 0, deviceSN: Gn }),
            c = new bn({ uid: t, deviceSN: 0 }),
            d = new Sn();
          d.setCommond(g.SYNC);
          const l = new Dn(),
            p = new wn({
              from: u,
              to: c,
              content: n,
              ctype: a,
              type: N.GROUPCHAT,
              ext: i,
            });
          s > 0 && (p.priority = s),
            a > 0 && o && (p.attachment = JSON.stringify(o));
          const f = new Cn({
            id: new Date().getTime(),
            from: u,
            to: c,
            payload: p,
            ns: E.MESSAGE,
            timestamp: new Date().getTime(),
          });
          return l.setMeta(f), d.setPayload(l), d;
        },
        jn = (e) => {
          const {
            uid: t,
            content: n,
            type: r = "text",
            ext: o,
            attachment: i,
          } = e;
          re("imSendRosterMessage", e);
          let s = Object.keys(A).indexOf(r.toUpperCase());
          const a = new bn({ uid: z.getUid() - 0, deviceSN: Gn }),
            u = new bn({ uid: t - 0, deviceSN: 0 }),
            c = new Sn();
          c.setCommond(g.SYNC);
          const d = new Dn(),
            l = new wn({
              from: a,
              to: u,
              content: n,
              ctype: s,
              type: N.CHAT,
              ext: o,
            });
          s > 0 && i && (l.attachment = JSON.stringify(i));
          const p = new Cn({
            id: new Date().getTime(),
            from: a,
            to: u,
            payload: l,
            ns: E.MESSAGE,
            timestamp: new Date().getTime(),
          });
          return d.setMeta(p), c.setPayload(d), c;
        },
        Fn = (e, t) => {
          t = x(t);
          const n = new Sn();
          n.setCommond(g.SYNC);
          const r = new bn({ uid: z.getUid(), deviceSN: Gn }),
            o = new bn({ uid: U(e), deviceSN: 0 }),
            i = new Dn(),
            s = new wn({
              from: r,
              to: o,
              ctype: A.COMMAND,
              type: N.OPER,
              operation: { type: b.READ_ACK, mid: t },
            }),
            a = new Cn({
              id: new Date().getTime() + Math.floor(256 * Math.random()),
              from: r,
              to: o,
              payload: s,
              ns: E.MESSAGE,
            });
          return i.setMeta(a), n.setPayload(i), n;
        },
        Vn = (e, t) => {
          t = x(t);
          const n = new Sn();
          n.setCommond(g.SYNC);
          const r = new bn({ uid: z.getUid(), deviceSN: Gn }),
            o = new bn({ uid: U(e), deviceSN: 0 }),
            i = new Dn(),
            s = new wn({
              ctype: A.COMMAND,
              type: N.OPER,
              operation: { type: b.RECALL, mid: t, xid: o },
            }),
            a = new Cn({
              id: parseInt(
                new Date().getTime() + "" + Math.floor(256 * Math.random())
              ),
              from: r,
              to: o,
              payload: s,
              ns: E.MESSAGE,
            });
          return i.setMeta(a), n.setPayload(i), n;
        },
        qn = (e, t) => {
          const n = new Sn();
          n.setCommond(g.SYNC);
          const r = new bn({ uid: z.getUid(), deviceSN: Gn }),
            o = new bn({ uid: U(e), deviceSN: 0 }),
            i = new Dn(),
            s = new wn({
              from: r,
              to: r,
              ctype: A.COMMAND,
              type: N.OPER,
              operation: { type: b.READ_ALL, xid: o, mid: t },
            }),
            a = new Cn({
              id: parseInt(
                new Date().getTime() + "" + Math.floor(256 * Math.random())
              ),
              from: r,
              to: r,
              payload: s,
              ns: E.MESSAGE,
            });
          return i.setMeta(a), n.setPayload(i), n;
        },
        Jn = (e, t, n) => {
          const { content: r, attach: o, type: i } = n;
          return e
            ? jn({ uid: e, content: r, type: i, attachment: o })
            : Bn({ gid: t, content: r, type: i, attachment: o });
        },
        Kn = {};
      let Yn = !1;
      const Wn = (e) => {
          const { status: t = {} } = e,
            { code: n, reason: r } = t;
          if (n === m.OK) return !0;
          if (void 0 === t.code) return !0;
          if (
            ((n !== m.INVALID_TOKEN && n !== m.UNAUTHORIZED) ||
              re("flooNotice", { category: "action", desc: "relogin" }),
            (n !== m.USER_FROZEN &&
              n !== m.INVALID_LICENSE &&
              n !== m.LICENSE_LIMIT &&
              n !== m.APP_FROZEN) ||
              re("flooNotice", {
                category: "action",
                desc: "relogin_manually",
              }),
            n === m.USER_BANNED)
          ) {
            re("flooError", { category: "USER_BANNED", desc: "用户被禁言" });
          } else if (n === m.USER_FROZEN) {
            re("flooError", {
              category: "USER_FROZEN",
              desc: "用户被冻结，请联系App管理员。",
            });
          } else if (n === m.APP_FROZEN) {
            re("flooError", {
              category: "APP_FROZEN",
              desc: "APP 被冻结，请登陆蓝莺IM控制台查看详情。",
            });
          } else if (n === m.INVALID_LICENSE) {
            re("flooError", {
              category: "LICENSE",
              desc: "无效 LICENSE，请确认服务已按时付费。",
            });
          } else if (n === m.LICENSE_LIMIT) {
            re("flooError", {
              category: "LICENSE",
              desc: "超出 LICENSE 用户数限制，请购买更高规格服务。",
            });
          } else {
            re("flooError", { category: n, desc: r });
          }
          const { client_mid: o } = e;
          return (
            o &&
              re("onSendingMessageStatusChanged", {
                status: "failed",
                mid: U(o),
              }),
            l.error("ret error ......code:", n, "...reason:", r),
            !1
          );
        },
        Hn = (e) => {
          const { unread: t = [] } = e;
          re("imReceivedUnread", t),
            t.forEach((e) => {
              const { xid: t, n: n } = e;
              n > 0 && re("sendMessage", Pn({ xid: t, next_key: 0 }));
            });
        },
        Zn = (e) => {
          const { xid: t } = e,
            { uid: n = 0 } = t;
          Kn[n + ""]
            ? setTimeout(() => {
                (Kn[n] = !1), Zn(e);
              }, 3e3)
            : ((Kn[n + ""] = !0),
              re(
                "sendMessage",
                ((e) => {
                  e.uid = e.uid || 0;
                  const t = new Sn();
                  t.setCommond(g.SYNC);
                  const n = new Dn();
                  return n.setXid(e), t.setPayload(n), t;
                })(t)
              ));
        },
        Xn = (e) => {
          if (!Wn(e))
            return (
              re("flooNotice", {
                category: "loginMessage",
                desc: "login socket failure ......",
              }),
              void re("loginFail", "socket_failure")
            );
          const { xid: t = {} } = e,
            { deviceSN: n } = t;
          re("temporary_deviceSN", n),
            Yn || (n && z.saveDeviceSN(n)),
            re("flooNotice", {
              category: "loginMessage",
              desc: "login socket success.....",
            }),
            re("loginSuccess", {}),
            re("sendMessage", { vsn: 0, compress_method: 0, command: 0 });
        },
        $n = (e) => {
          if (!Wn(e)) return;
          const { metas: t = [], xid: n, is_full_sync: r, client_mid: o } = e;
          if (!r && o && x(o).gt(0))
            return (
              re("receivedSendMessage", o),
              void setTimeout(() => {
                ce.dealSendedRosterMessage(e), ce.dealSendedGroupMessage(e);
              }, 20)
            );
          let { next_key: i = 0 } = e;
          if (0 === i || x(i).eq(0)) {
            const { uid: e = 0 } = n;
            delete Kn[e + ""];
          }
          r
            ? (t && t.length && zn(t), re("onReceiveHistoryMsg", { next: i }))
            : (t.length && zn(t),
              0 === i ||
                x(i).eq(0) ||
                re("sendMessage", Pn({ xid: n, next_key: i })));
        },
        zn = (e = []) => {
          e.forEach((e) => {
            const { ns: t } = e;
            t === E.UNKNOWN && l.log("received unknown message ...", e),
              t === E.MESSAGE && er(e),
              t === E.GROUP_NOTICE && tr(e),
              t === E.ROSTER_NOTICE && nr(e),
              t === E.USER_NOTICE && rr(e),
              t === E.CONVERSATION && Qn(e);
          });
        },
        Qn = (e) => {
          const { payload: t = {} } = e,
            { type: n, operation: r } = t;
          if (n === R.OPER)
            if (r.type == T.DELETE || r.type == T.DELETE_EVERYWHERE) {
              const { xid: e } = r;
              re("deleteConversation", {
                id: e.uid,
                source: "other_operation",
              });
            } else l.log("received unknown conversation operation: ", r);
          else l.log("received unknown conversation: ", e);
        },
        er = (e) => {
          const { payload: t = {} } = e,
            { type: n, operation: r } = t;
          n === N.NORMAL && re("messageNormal", e),
            n === N.CHAT && re("imRosterMessage", e),
            n === N.GROUPCHAT && re("imGroupMessage", e),
            n === N.OPER &&
              (r.type === b.UNKNOWN && l.log("received unknown operation: ", e),
              (e.isReceived = !0),
              re("onActionMessage", e));
        },
        tr = (e) => {
          const { payload: t = {} } = e,
            { type: n } = t;
          n === O.UNKNOWN && l.log("received unknown groupnotice: ", e),
            n === O.PRESENCE && re("imGroupPresence", e),
            n === O.ABSENCE && re("imGroupAbesence", e),
            n === O.CREATED && re("imGroupCreated", e),
            n === O.DESTROYED && re("imGroupDestoryed", e),
            n === O.JOINED && re("imGroupJoined", e),
            n === O.APPLYED && re("imGroupApplyed", e),
            n === O.APPLY_ACCEPTED && re("imGroupApplyAccepted", e),
            n === O.APPLY_DECLINED && re("imGroupApplyDeclined", e),
            n === O.INVITED && re("imGroupInvited", e),
            n === O.INVITE_ACCEPTED && re("imGroupInvitedAccepted", e),
            n === O.INVITE_DECLINED && re("imGroupInvitedDeclined", e),
            n === O.KICKED && re("imGroupKicked", e),
            n === O.LEAVED && re("imGroupLeaved", e),
            n === O.BANNED && re("imGroupBaned", e),
            n === O.UNBANNED && re("imGroupUnbaned", e),
            n === O.OWNER_ASSIGNED && re("imGroupOwnerAssigned", e),
            n === O.ADMIN_GRANTED && re("imGroupAdminGranted", e),
            n === O.ADMIN_REVOKED && re("imGroupAdminRevoked", e),
            n === O.BLOCKED && re("imGroupBlocked", e),
            n === O.UNBLOCKED && re("imGroupUnblocked", e),
            n === O.MUTED && re("imGroupMuted", e),
            n === O.UNMUTED && re("imGroupUnmuted", e),
            n === O.INFO_UPDATED && re("imGroupInfoUpdated", e),
            n === O.ANNOUNCEMENT_UPDATED && re("imGroupAnnouncementUpdated", e);
        },
        nr = (e) => {
          const { payload: t = {} } = e,
            { type: n } = t;
          n === I.UNKNOWN && l.log("received unknown rosterNotice: ", e),
            n === I.ADDED && re("imRosterAdded", e),
            n === I.REMOVED && re("imRosterRemoved", e),
            n === I.APPLIED && re("imRosterApplied", e),
            n === I.ACCEPTED && re("imRosterAccepted", e),
            n === I.DECLINED && re("imRosterDeclined", e),
            n === I.BANNED && re("imRosterBaned", e),
            n === I.UNBANNED && re("imRosterUnbaned", e),
            n === I.INFO_UPDATED && re("imRosterInfoUpdated", e);
        },
        rr = (e) => {
          const { payload: t = {} } = e,
            { type: n } = t;
          (n !== k.UNKNOWN &&
            n !== k.PASSWORD_CHANGED &&
            n !== k.FROZEN &&
            n !== k.REMOVED &&
            n !== k.KICKED_BY_OTHER_DEVICE &&
            n !== k.DEVICE_REMOVED &&
            n !== k.CLUSTER_CHANGED) ||
            (z.deleteToken(),
            z.deleteDeviceSN(),
            re("flooNotice", { category: "action", desc: "relogin_manually" })),
            n === k.UNKNOWN && l.log("received unknown userNotice: ", e),
            n === k.KICK_BY_SAME_DEVICE && ((Yn = !0), re("userKicked")),
            re("flooNotice", {
              category: "userNotice",
              desc: Object.keys(k)[n],
            });
        };
      var or = (e) => {
          const { command: t = 0, payload: n } = e;
          t === g.UNREAD && Hn(n),
            t === g.SYNC && $n(n),
            t === g.NOTICE && Zn(n),
            t === g.PROVISION && Xn(n);
        },
        ir = n(0),
        sr = n.n(ir),
        ar = n(2),
        ur = n.n(ar);
      const cr = sr.a.Root.fromJSON(ur.a).lookupType(
          "im.floo.protobuf.Provision"
        ),
        dr = (e) => cr.decode(e),
        lr = (e) => cr.encode(e).finish();
      const pr = sr.a.Root.fromJSON(ur.a).lookupType("im.floo.protobuf.XID"),
        fr = (e) => pr.encode(e).finish();
      var hr = n(32),
        gr = n.n(hr);
      const yr = sr.a.Root.fromJSON(gr.a).lookupType(
          "im.floo.protobuf.MessageBody"
        ),
        mr = (e) => yr.decode(e),
        vr = (e) => yr.encode(e).finish();
      var _r = n(33),
        Er = n.n(_r);
      const Nr = sr.a.Root.fromJSON(Er.a).lookupType(
          "im.floo.protobuf.GroupNotice"
        ),
        br = (e) => Nr.decode(e),
        Ar = (e) => {
          e.from = fr(e.from);
          const t = [];
          return (
            (e.to || []).forEach((e) => {
              t.push(fr(e));
            }),
            (e.to = t),
            Nr.encode(e).finish()
          );
        };
      var wr = n(34),
        Or = n.n(wr);
      const Sr = sr.a.Root.fromJSON(Or.a).lookupType(
          "im.floo.protobuf.RosterNotice"
        ),
        Ir = (e) => Sr.decode(e),
        kr = (e) => Sr.encode(e).finish();
      var Rr = n(35),
        Tr = n.n(Rr);
      const Dr = sr.a.Root.fromJSON(Tr.a).lookupType(
          "im.floo.protobuf.UserNotice"
        ),
        Mr = (e) => Dr.decode(e),
        Cr = (e) => Dr.encode(e).finish();
      var Ur = n(36),
        xr = n.n(Ur);
      const Gr = sr.a.Root.fromJSON(xr.a).lookupType("im.floo.protobuf.Info"),
        Lr = (e) => Gr.decode(e),
        Pr = (e) => Gr.encode(e).finish();
      var Br = n(37),
        jr = n.n(Br);
      const Fr = sr.a.Root.fromJSON(jr.a).lookupType(
          "im.floo.protobuf.Conversation"
        ),
        Vr = (e) => Fr.decode(e),
        qr = (e) => Fr.encode(e).finish();
      const Jr = sr.a.Root.fromJSON(ur.a).lookupType("im.floo.protobuf.Meta");
      const Kr = sr.a.Root.fromJSON(ur.a).lookupType("im.floo.protobuf.SyncUL"),
        Yr = (e) => Kr.decode(e),
        Wr = (e) => {
          e.meta &&
            (e.meta = ((e) => {
              const { ns: t, payload: n } = e;
              return (
                t === E.MESSAGE && (e.payload = vr(n)),
                t === E.GROUP_NOTICE && (e.payload = Ar(n)),
                t === E.ROSTER_NOTICE && (e.payload = kr(n)),
                t === E.USER_NOTICE && (e.payload = Cr(n)),
                t === E.INFO && (e.payload = Pr(n)),
                t === E.CONVERSATION && (e.payload = qr(n)),
                Jr.create(e)
              );
            })(e.meta));
          return Kr.encode(e).finish();
        };
      const Hr = sr.a.Root.fromJSON(ur.a).lookupType(
          "im.floo.protobuf.UnreadDL"
        ),
        Zr = sr.a.Root.fromJSON(ur.a).lookupType("im.floo.protobuf.SyncDL");
      const Xr = sr.a.Root.fromJSON(ur.a).lookupType("im.floo.protobuf.Notice"),
        $r = (e) => ({ xid: ((e) => pr.decode(e))(e) });
      const zr = sr.a.Root.fromJSON(ur.a).lookupType("im.floo.protobuf.Frame"),
        Qr = (e) => {
          e = new Uint8Array(e);
          const t = zr.decode(e),
            { command: n, payload: r } = t;
          return (
            n === g.UNREAD
              ? (t.payload = ((e) => Hr.decode(e))(r))
              : n === g.SYNC
              ? (t.payload = ((e) => {
                  const t = Zr.decode(e),
                    { metas: n = [] } = t,
                    r = [];
                  return (
                    n.forEach((e) => {
                      const { ns: t, payload: n } = e;
                      t === E.MESSAGE && (e.payload = mr(n)),
                        t === E.GROUP_NOTICE && (e.payload = br(n)),
                        t === E.ROSTER_NOTICE && (e.payload = Ir(n)),
                        t === E.USER_NOTICE && (e.payload = Mr(n)),
                        t === E.INFO && (e.payload = Lr(n)),
                        t === E.CONVERSATION && (e.payload = Vr(n)),
                        r.push(e);
                    }),
                    (t.metas = r),
                    t
                  );
                })(r))
              : n === g.NOTICE
              ? (t.payload = $r(r))
              : n === g.PROVISION && (t.payload = dr(r)),
            t
          );
        },
        eo = (e) => {
          const { payload: t, command: n } = e;
          t &&
            (n === g.UNREAD
              ? (e.payload = ((e) => Hr.encode(e).finish())(t))
              : n === g.SYNC
              ? (e.payload = Wr(t))
              : n === g.NOTICE
              ? (e.payload = ((e) => Xr.encode(e).finish())(t))
              : n === g.PROVISION && (e.payload = lr(t)));
          return zr.encode(e).finish();
        };
      (sr.a.util.Long = f.a), sr.a.configure();
      const { encode: to } = i,
        { encode: no, decode: ro } = a,
        { encode: oo } = s;
      let io = {};
      let so = 0,
        ao = null;
      let uo = "normal",
        co = 0;
      let lo = null,
        po = 0;
      const fo = () => {
        let e = new Date().getTime(),
          t = po;
        setTimeout(() => {
          if (po == t && co < e) {
            l.error("=============== fail to receive unread in ", 2e4, " ms");
            try {
              lo.close();
            } catch (e) {}
            setTimeout(() => {
              re("reconnect", { reason: "UnreadTimeout", forSocketVersion: t });
            }, 200);
          }
        }, 2e4);
      };
      te("refresh_fireplace", (e) => {
        io = Object.assign({ fireplace: e }, io);
      }),
        te("loginSuccess", () => {
          (so = 0),
            ao && clearInterval(ao),
            (ao = setInterval(() => {
              fo(), _o({ vsn: 0, compress_method: 0, command: 0 });
            }, 5e4));
        }),
        te("sendMessage", (e) => {
          _o(e);
        }),
        te("userKicked", () => {
          uo = "kick";
        }),
        te("reconnect", ({ reason: e, forSocketVersion: t }) => {
          l.warn("socket reconnect due to ", e, " user status: ", uo),
            "normal" === uo && go(t, e);
        });
      const ho = (e) => {
          if (e != po) return;
          const { fireplace: t } = io;
          l.log("................................. will connect : ", t),
            re("flooNotice", {
              category: "loginMessage",
              desc: "socket connecting...",
            }),
            po++,
            (lo = wx.connectSocket({
              url: t,
              tcpNoDelay: !0,
              timeout: 1e4 + 2e4 * so,
              success: () => {
                l.info("================= Success connect to", t),
                  re("flooNotice", {
                    category: "loginMessage",
                    desc: "socket connect success...",
                  });
              },
              fail: (e) => {
                l.error(
                  "================= Failed to connect ",
                  t,
                  " error: ",
                  e
                ),
                  re("reconnect", {
                    reason: "ConnectFail",
                    forSocketVersion: po,
                  });
              },
            })),
            lo.onOpen(function () {
              l.log("=================  socket connected "), mo();
            }),
            lo.onMessage((e) => {
              vo(e.data);
            }),
            lo.onError((e) => {
              l.error("=================  socket error: ", e), lo.close();
            }),
            lo.onClose((e) => {
              l.error("=================  socket disconnected due to ", e),
                re("reconnect", {
                  reason: "closed_by_peer",
                  forSocketVersion: po,
                });
            });
        },
        go = (e, t) => {
          so >= 5 ? ((so = 0), re("fireplaceError")) : so++, yo(e, t);
        },
        yo = (e, t) => {
          const n = ((e) =>
            1 == so || "SendFail" == e || "UnreadTimeout" == e
              ? 0
              : Math.floor(9e3 * Math.random()) + 1e3)(t);
          l.error(
            "================= socket will reconnect in ",
            n,
            " ms (",
            so,
            ")"
          ),
            setTimeout(() => {
              ho(e);
            }, n);
        },
        mo = () => {
          l.log("=============== sending proversion =========="),
            re("flooNotice", {
              category: "loginMessage",
              desc: "logining socket service...",
            }),
            re(
              "sendMessage",
              ((e) => {
                const t = new bn({ uid: e.uid - 0, deviceSN: Gn }),
                  n = new kn();
                Ln || (Ln = z.getDeviceGuid()),
                  n.setXid(t),
                  n.setToken(e.token),
                  n.setDeviceguid(Ln),
                  n.setSdkvsn("2.0.0"),
                  n.setEncryptmethod(_.AES_CBC_128),
                  n.setEncryptkey(z.getAesKey()),
                  n.setDeviceinfo("Uniapp");
                const r = new Sn();
                return r.setCommond(g.PROVISION), r.setPayload(n), r;
              })({ token: z.getToken(), uid: z.getUid() })
            );
        },
        vo = (e) => {
          co = new Date().getTime();
          const t = ((e) => ro(e))(e);
          l.info("RECV :" + JSON.stringify(M(t))), or(t);
        },
        _o = (e) => {
          l.info("SEND :" + JSON.stringify(M(e)));
          const t = no(e),
            n = new ArrayBuffer(t.length),
            r = new Uint8Array(n);
          t.forEach((e, t) => {
            r[t] = e;
          }),
            lo.send({
              data: n,
              fail: function (e) {
                const { errMsg: t } = e;
                l.error("=============== fail to send message, err: ", t);
                try {
                  lo.close();
                } catch (e) {}
                let n = po;
                setTimeout(() => {
                  re("reconnect", { reason: "SendFail", forSocketVersion: n });
                }, 200);
              },
            });
        };
      var Eo = Object.assign(o, {
        connect: function (e) {
          (io = e), (so = 0), (uo = "normal"), ho(po);
        },
        sendMessage: _o,
        disConnect: () => {
          (uo = "logout"), lo && lo.close();
        },
      });
      var No = {
        asyncGetRosterIdList: (e) =>
          e
            ? Eo.rosterList({}).then(
                (e) => (pe.saveRosterList(e), e.map((e) => e.user_id || e))
              )
            : Promise.resolve(pe.getRosterList()),
        asyncGetRosterInfo: (e, t) => {
          const n = pe.getRosterInfo(e);
          return n && n.username && !t
            ? Promise.resolve(n)
            : Eo.rosterListPost({ list: [e] }).then(
                (t) => (
                  pe.saveRosterInfo(t),
                  re("onRosterInfoUpdate", [e]),
                  (t.length && t[0]) || {}
                )
              );
        },
        asyncRegester: (e) => Eo.userRegister(e),
        asnycGetRosterListDetailByIds: (e) => {
          if (!e || !e.length) return Promise.resolve({});
          const t = pe.getAllRosterInfos(),
            n = [];
          e.forEach((e) => {
            const r = t[e];
            (r && r.username) || n.push(e);
          });
          const r = Array.from(new Set(n));
          return r.length
            ? Eo.rosterListPost({ list: r }).then(
                (e) => (pe.saveRosterInfo(e), re("onRosterInfoUpdate", r), e)
              )
            : Promise.resolve();
        },
        asyncGetUserProfile: (e) => {
          const t = z.getProfile();
          return t && (t.name || t.mobile) && !e
            ? Promise.resolve(t)
            : Eo.userProfile().then((e) => (z.saveProfile(e), e));
        },
        getRosterMessageByRid: (e) => ce.getRosterMessage(e),
        readRosterMessage: (e, t) => {
          re("imReadRosterMessage", { roster_id: e, mid: t });
        },
        asyncDeleteRoster: (e) =>
          Eo.rosterDelete(e).then(
            (t) => (
              pe.removeRoster(e.user_id),
              ie.deleteRecentById(e.user_id),
              re("onRosterListUpdate"),
              t
            )
          ),
        getAllRosterDetail: () => pe.getAllRosterInfos(),
        recallMessage: (e, t) => {
          const n = Vn(e, t);
          re("swapSendMessage", M(n)), re("sendMessage", n);
        },
        deleteMessage: (e, t) => {
          const n = ((e, t) => {
            t = x(t);
            const n = new Sn();
            n.setCommond(g.SYNC);
            const r = new bn({ uid: z.getUid(), deviceSN: Gn }),
              o = new bn({ uid: U(e), deviceSN: 0 }),
              i = new Dn(),
              s = new wn({
                ctype: A.COMMAND,
                type: N.OPER,
                operation: { type: b.DELETE, mid: t, xid: o },
              }),
              a = new Cn({
                id: parseInt(
                  new Date().getTime() + "" + Math.floor(256 * Math.random())
                ),
                from: r,
                to: r,
                payload: s,
                ns: E.MESSAGE,
              });
            return i.setMeta(a), n.setPayload(i), n;
          })(e, t);
          re("swapSendMessage", M(n)), re("sendMessage", n);
        },
        getUnreadCount: (e) => ce.getUnreadByRosterId(e),
        unreadMessage: (e, t) => {
          const n = ((e, t) => {
            t = x(t);
            const n = new Sn();
            n.setCommond(g.SYNC);
            const r = new bn({ uid: z.getUid(), deviceSN: Gn }),
              o = new bn({ uid: U(e), deviceSN: 0 }),
              i = new Dn(),
              s = new wn({
                ctype: A.COMMAND,
                type: N.OPER,
                operation: { type: b.READ_CANCEL, mid: t, xid: o },
              }),
              a = new Cn({
                id: parseInt(
                  new Date().getTime() + "" + Math.floor(256 * Math.random())
                ),
                from: r,
                to: r,
                payload: s,
                ns: E.MESSAGE,
              });
            return i.setMeta(a), n.setPayload(i), n;
          })(e, t);
          re("swapSendMessage", M(n)), re("sendMessage", n);
        },
        getRosterInfo: (e) => pe.getRosterInfo(e),
        asyncGetApplyList: Eo.rosterApplylist,
        asyncGetBlockedlist: Eo.rosterBlockedlist,
        asyncBlockeAdd: Eo.rosterBlockedAdd,
        asyncBlockeRemove: Eo.rosterBlockeRemove,
        asyncApply: Eo.rosterApply,
        asyncAccept: Eo.rosterAccept,
        asyncDecline: Eo.rosterDecline,
        asyncUpdateRosterExt: Eo.rosterExt,
        asyncSearchRosterByName: Eo.rosterName,
        asyncSearchRosterById: Eo.rosterId,
      };
      te("imRostersGroupslistReady", (e) => {
        const { rosters: t } = e;
        pe.saveRosterList([].concat(t)), t.push(z.getUid()), Oo(t);
      });
      const bo = {},
        Ao = (e) => new Date().getTime() - (bo[e] || 0) < 1e3,
        wo = (e) => {
          const t = new Date().getTime();
          bo[e] = t;
        },
        Oo = (e = []) => {
          Array.isArray(e) || (e = [e]);
          const t = pe.getAllRosterInfos() || {},
            n = [];
          e.forEach((e) => {
            if ((e = e.user_id || e) > 0) {
              const r = t[e] || {},
                { avatar: o, nick_name: i, username: s } = r;
              o || i || s || (e && !Ao(e) && n.push(e) && wo(e));
            }
          }),
            n.length && ko(n);
        },
        So = (e = [], t = !1) => {
          if ((Array.isArray(e) || (e = [e]), t)) return void Ro(e);
          const n = K.getAllGroupInfos() || {},
            r = [];
          e.forEach((e) => {
            const t = e.group_id || e;
            if (e > 0) {
              const e = n[t] || {},
                { name: o } = e;
              o || r.push(t);
            }
          }),
            r.length && Ro(r);
        },
        Io = [],
        ko = (e = []) => {
          let t = e.filter((e) => Io.indexOf(e) < 0);
          t.length &&
            Ve({ list: t }).then((e) => {
              t.forEach((t) => {
                e.findIndex((e) => e.user_id == t) < 0 && Io.push(t);
              }),
                pe.saveRosterInfo(e),
                re("onRosterInfoUpdate");
            });
        },
        Ro = (e = []) => {
          e.length &&
            Ct({ group_list: e }).then((e) => {
              K.saveGroupInfo(e), re("onGroupListUpdate");
            });
        },
        To = (e, t, n, r) => {
          if (n) {
            const t = K.getGroupMembers(e);
            if (!t || !t.length) return;
          }
          void 0 !== t &&
            (Array.isArray(t) || (t = [t]),
            Ut({ group_id: e, user_list: t }).then((t) => {
              if (!t || !t.length) return;
              const n = [],
                o = pe.getAllRosterInfos();
              t.forEach((e) => {
                o[e.user_id] && o[e.user_id].username
                  ? ((e.display_name = e.display_name || o[e.user_id].username),
                    (e.avatar = o[e.user_id].avatar))
                  : n.push(e.user_id);
              }),
                n.length
                  ? Ve({ list: n }).then((n) => {
                      pe.saveRosterInfo(n);
                      const o = pe.getAllRosterInfos();
                      (t = t.map(
                        (e) => (
                          e.display_name ||
                            (e.display_name =
                              e.display_name || o[e.user_id].username),
                          (e.avatar = o[e.user_id].avatar),
                          e
                        )
                      )),
                        K.saveGroupMembers(e, t, r),
                        re("onGroupMemberChanged", e);
                    })
                  : (K.saveGroupMembers(e, t, r),
                    re("onGroupMemberChanged", e));
            }));
        },
        Do = (e, t) => {
          K.removeGroupMembers(e, t), re("onGroupMemberChanged", e);
        };
      te("imRostersGroupslistReady", (e) => {
        const { groups: t } = e;
        K.saveJoinedGroups([].concat(t)), So(t);
      }),
        te("imRosterMessage", (e) => {
          const t = L(e),
            { ext: n = "", from: r, to: o } = t;
          let i = {};
          try {
            i = JSON.parse(n);
          } catch (e) {}
          if (void 0 !== i.input_status && r != z.getUid())
            re("onInputStatusMessage", { ext: n, from: r, to: o });
          else {
            ce.saveRosterMessage(t), (t.toType = "roster"), ie.saveRecent(t);
            const e = z.getUid() == r ? o : r;
            Oo(e), re("onUnreadChange", e);
          }
          re("onRosterMessage", t);
        }),
        te("imSendRosterMessage", (e) => {
          Oo(e.uid);
        }),
        te("imGetRecent", (e) => {
          Oo(e);
        }),
        te("imGroupMessage", (e) => {
          const t = L(e);
          ce.saveGroupMessage(t), (t.toType = "group"), ie.saveRecent(t);
          const n = z.getUid(),
            { config: r } = t;
          r &&
            r.mentionList &&
            r.mentionList.indexOf(n) >= 0 &&
            re("onMentionMessage", t),
            re("onGroupMessage", t);
        }),
        te("imReceivedUnread", (e) => {
          const t = e.filter((e) => 1 === e.type).map((e) => U(e.xid.uid)),
            n = e.filter((e) => 2 === e.type).map((e) => U(e.xid.uid));
          Mo(t), Oo(t), Co(n), So(n);
        });
      const Mo = (e) => {
          const t = pe.getAllRosterInfos() || {},
            n = [];
          e.forEach((e) => {
            const r = t[e] || {},
              { avatar: o, nick_name: i, username: s } = r;
            o || i || s || (e && !Ao(e) && n.push(e) && wo(e));
          }),
            n.length
              ? Ve({ list: n }).then((t) => {
                  pe.saveRosterInfo(t), ie.saveUnreadRecent(e, "roster");
                })
              : ie.saveUnreadRecent(e, "roster");
        },
        Co = (e) => {
          const t = K.getAllGroupInfos() || {},
            n = [];
          e.forEach((e) => {
            const r = t[e] || {},
              { name: o } = r;
            o || (e && n.push(e));
          }),
            n.length
              ? Ct({ group_list: n }).then((t) => {
                  K.saveGroupInfo(t),
                    re("onGroupListUpdate"),
                    ie.saveUnreadRecent(e, "group");
                })
              : ie.saveUnreadRecent(e, "group");
        };
      te("imRosterAdded", (e) => {
        const { payload: t } = e,
          { to: n = [], from: r } = t,
          o = z.getUid();
        1 === n.length &&
          U(n[0].uid) === o &&
          (Oo([U(r.uid)]),
          pe.saveRosterList(U(r.uid)),
          re("onRosterListUpdate", e));
      }),
        te("imRosterRemoved", (e) => {
          const { payload: t } = e,
            { from: n, to: r = [] } = t,
            o = z.getUid();
          if (U(n.uid) === o && 1 === r.length) {
            const t = U(r[0].uid);
            pe.removeRoster(t),
              de.saveNotice(e),
              ie.deleteRecentById(t),
              ce.deleteRosterMessageByRosterId(t),
              re("onRosterRemoved", e);
          }
        }),
        te("imRosterApplied", (e) => {
          re("onRosterApplied", e);
        }),
        te("imRosterAccepted", (e) => {
          const { payload: t } = e,
            { from: n, to: r = [] } = t,
            o = z.getUid(),
            i = U(n.uid);
          if (1 === r.length) {
            const t = U(r[0].uid);
            i === o
              ? (de.removeNotice(e), pe.saveRosterList(t), Oo(t))
              : t === o && (pe.saveRosterList(i), Oo(i)),
              re("onRosterAccepted", e);
          }
        }),
        te("imRosterDeclined", (e) => {
          const { payload: t } = e,
            { from: n, to: r = [] } = t,
            o = z.getUid(),
            i = U(n.uid);
          if (1 === r.length) {
            const t = U(r[0].uid);
            i === o
              ? (de.removeNotice(e), de.saveNotice(e))
              : t === o && de.saveNotice(e),
              re("onRosterDeclined", e);
          }
        }),
        te("imRrosterBaned", (e) => {
          re("onRosterNotice", e);
        }),
        te("imRosterUnbaned", (e) => {
          re("onRosterNotice", e);
        }),
        te("imRosterInfoUpdated", (e) => {
          const { payload: t } = e,
            { from: n, content: r = "{}" } = t,
            o = U(n.uid);
          let i = {};
          try {
            i = JSON.parse(r);
          } catch (e) {}
          if (Object.keys(i).length) {
            let e = Object.assign({}, pe.getRosterInfo(o), i);
            pe.saveRosterInfo([e]),
              re("onRosterInfoUpdated"),
              re("onRosterListUpdate");
          }
        }),
        te("imGroupCreated", (e) => {
          const { payload: t } = e,
            { gid: n, from: r } = t,
            o = z.getUid(),
            i = U(n.uid),
            s = U(r.uid);
          K.saveJoinedGroups(i),
            s !== o && Oo(s),
            So(i),
            re("onGroupListUpdate", e),
            re("onGroupCreated", e);
        }),
        te("imGroupDestoryed", (e) => {
          const { payload: t } = e,
            { gid: n, from: r } = t,
            o = z.getUid(),
            i = U(n.uid),
            s = U(r.uid);
          s !== o && Oo(s),
            K.removeGroup(i),
            de.saveNotice(e),
            ie.deleteRecentById(n),
            ce.deleteGroupMessageByGid(n),
            re("onGroupListUpdate"),
            re("onGroupDestoryed", e);
        }),
        te("imGroupJoined", (e) => {
          const { payload: t } = e,
            { gid: n, from: r, to: o = [] } = t,
            i = U(r.uid),
            s = z.getUid(),
            a = U(n.uid),
            u = [];
          o.forEach((e) => {
            u.push(U(e.uid));
          }),
            i === s
              ? (K.saveJoinedGroups(a), So(a), re("onGroupListUpdate"))
              : (To(a, i, !0), Oo(i), re("onGroupMemberChanged", a)),
            re("onGroupJoined", e);
        }),
        te("imGroupApplyed", (e) => {
          const { payload: t } = e,
            { from: n } = t,
            r = U(n.uid);
          r !== z.getUid() && (Oo([r]), de.saveNotice(e));
        }),
        te("imGroupApplyAccepted", (e) => {
          const { payload: t } = e,
            { gid: n, from: r, to: o = [] } = t,
            i = U(r.uid),
            s = z.getUid(),
            a = U(n.uid),
            u = [];
          o.forEach((e) => {
            u.push(U(e.uid));
          }),
            i === s
              ? (de.removeNotice(e),
                Oo(u),
                To(a, u, !0),
                re("onGroupMemberChanged", a))
              : (K.saveJoinedGroups(a), So(a), Oo(i), re("onGroupListUpdate")),
            re("onGroupApplyAccepted", e);
        }),
        te("imGroupApplyDeclined", (e) => {
          const { payload: t } = e,
            { from: n, to: r } = t,
            o = U(n.uid),
            i = z.getUid(),
            s = [];
          r.forEach((e) => {
            s.push(U(e.uid));
          }),
            o === i ? Oo(s) : de.saveNotice(e),
            re("onGroupApplyDeclined", e);
        }),
        te("imGroupInvited", (e) => {
          const { payload: t } = e,
            { gid: n, from: r, to: o = [] } = t,
            i = U(r.uid),
            s = z.getUid(),
            a = U(n.uid),
            u = [];
          o.forEach((e) => {
            u.push(U(e.uid));
          }),
            i === s
              ? Oo(u)
              : u.findIndex((e) => e === s) > -1
              ? (Oo(i), So(a), de.saveNotice(e))
              : Oo(u),
            re("onGroupNotice", e);
        }),
        te("imGroupInvitedAccepted", (e) => {
          const { payload: t } = e,
            { gid: n, from: r, to: o = [] } = t,
            i = U(r.uid),
            s = z.getUid(),
            a = U(n.uid),
            u = [];
          o.forEach((e) => {
            u.push(U(e.uid));
          }),
            i === s
              ? (de.removeNotice(e),
                K.saveJoinedGroups(a),
                So(a),
                re("onGroupListUpdate"))
              : (To(a, i, !0), Oo(i), re("onGroupMemberChanged", a)),
            re("onGroupInvitedAccepted", e);
        }),
        te("imGroupInvitedDeclined", (e) => {
          const { payload: t } = e,
            { gid: n, from: r } = t,
            o = U(r.uid),
            i = z.getUid(),
            s = U(n.uid);
          o === i ? (de.removeNotice(e), de.saveNotice(e), So(s)) : Oo(o),
            re("onGroupInvitedDeclined", e);
        }),
        te("imGroupKicked", (e) => {
          e = Object.assign({}, e);
          const { payload: t } = e,
            { gid: n, to: r = [] } = t,
            o = z.getUid(),
            i = U(n.uid),
            s = [];
          r.forEach((e) => {
            s.push(U(e.uid));
          }),
            s.findIndex((e) => e === o) > -1
              ? (K.removeGroup(i),
                de.saveNotice(e),
                ie.deleteRecentById(n),
                ce.deleteGroupMessageByGid(n),
                re("onGroupListUpdate"))
              : Do(i, s);
        }),
        te("imGroupLeaved", (e) => {
          e = Object.assign({}, e);
          const { payload: t } = e,
            { gid: n, from: r, to: o = [] } = t,
            i = U(r.uid),
            s = z.getUid(),
            a = U(n.uid),
            u = [i];
          i === s
            ? (K.removeGroup(a),
              de.saveNotice(e),
              ie.deleteRecentById(n),
              ce.deleteGroupMessageByGid(n),
              re("onGroupListUpdate"))
            : Do(a, u),
            re("onGroupLeaved", e);
        }),
        te("imGroupBlocked", (e) => {
          const { payload: t } = e,
            { gid: n, to: r = [] } = t,
            o = z.getUid(),
            i = U(n.uid),
            s = [];
          r.forEach((e) => {
            s.push(U(e.uid));
          }),
            s.findIndex((e) => e === o) > -1
              ? (K.removeGroup(i),
                de.saveNotice(e),
                ie.deleteRecentById(n),
                ce.deleteGroupMessageByGid(n),
                re("onGroupListUpdate"))
              : (Oo(s), Do(i, s));
        }),
        te("imGroupUnblocked", (e) => {
          const { payload: t } = e,
            { to: n = [] } = t,
            r = [];
          n.forEach((e) => {
            r.push(U(e.uid));
          }),
            Oo(r);
        }),
        te("imGroupOwnerAssigned", (e) => {
          const { payload: t } = e,
            { from: n, to: r = [] } = t,
            o = U(n.uid),
            i = z.getUid(),
            s = [];
          r.forEach((e) => {
            s.push(U(e.uid));
          }),
            o !== i && s.push(o),
            Oo(s),
            re("onGroupOwnerAssigned", e);
        }),
        te("imGroupAdminGranted", (e) => {
          const { payload: t } = e,
            { from: n, to: r = [] } = t,
            o = U(n.uid),
            i = z.getUid(),
            s = [];
          r.forEach((e) => {
            s.push(U(e.uid));
          }),
            o !== i && s.push(o),
            Oo(s),
            re("onGroupAdminGranted", e);
        }),
        te("imGroupAdminRevoked", (e) => {
          const { payload: t } = e,
            { from: n, to: r = [] } = t,
            o = U(n.uid),
            i = z.getUid(),
            s = [];
          r.forEach((e) => {
            s.push(U(e.uid));
          }),
            o !== i && s.push(o),
            Oo(s),
            re("onGroupAdminRevoked", e);
        }),
        te("imGroupMuted", (e) => {
          re("onGroupMuted", e);
        }),
        te("imGroupUnblocked", (e) => {
          re("onGroupUnblocked", e);
        }),
        te("imGroupBaned", (e) => {
          re("onGroupBaned", e);
        }),
        te("imGroupUnbaned", (e) => {
          re("onGroupUnbaned", e);
        }),
        te("imGroupInfoUpdated", (e) => {
          const { payload: t } = e,
            { gid: n, content: r = "{}" } = t,
            o = U(n.uid);
          let i = {};
          try {
            i = JSON.parse(r);
          } catch (e) {}
          if (Object.keys(i).length) {
            let e = Object.assign({}, K.getGroupInfo(o), i);
            K.saveGroupInfo([e]), re("onGroupListUpdate");
          }
        }),
        te("imGroupAnnouncementUpdated", (e) => {
          const { payload: t } = e,
            { gid: n } = t,
            r = U(n.uid);
          So(r, !0), re("onGroupAnnouncementUpdated", e);
        }),
        te("imReadRosterMessage", (e) => {
          const { roster_id: t, mid: n, isReceived: r } = e;
          let o = !1;
          if (n) {
            const e = ce.getRosterMessageById(t, n);
            if (Uo(e) && !r) {
              o = !0;
              const e = Fn(t, n);
              re("sendMessage", e);
            }
          } else {
            const e = ce.getRosterMessage(t);
            let n;
            if (
              (e.forEach((e) => {
                if (Uo(e) && !r) {
                  o = !0;
                  const n = Fn(t, e.id);
                  re("sendMessage", n);
                }
                n = e.id;
              }),
              ce.saveFormatedRosterMessage(t, e),
              !r && o)
            ) {
              const e = qn(t, n);
              re("sendMessage", e);
            }
          }
          o && re("onUnreadChange", t);
        });
      const Uo = (e) => {
          let t = !1;
          const n = xo(e, D.READ);
          if (e && n) {
            const n = z.getUid(),
              r = U(e.from);
            r > 0 && r != n && (t = !0);
          }
          return t;
        },
        xo = (e, t) => {
          let n = !1;
          if (e && e.status != t) {
            const r = e;
            (r.status = t), ce.saveRosterMessage(L(r)), (n = !0);
          }
          return n;
        };
      te("imReadGroupMessage", (e) => {
        const { group_id: t, mid: n, isReceived: r } = e;
        let o = !1;
        if (n) {
          const e = ce.getGroupMessageById(t, n);
          if (Go(e) && !r) {
            o = !0;
            const t = G(e.from),
              r = Fn(t, n);
            re("sendMessage", r);
          }
        } else {
          const e = ce.getGroupMessage(t);
          let n;
          if (
            (e.forEach((e) => {
              if (Go(e) && !r) {
                o = !0;
                const t = G(e.from),
                  n = Fn(t, e.id);
                re("sendMessage", n);
              }
              n = e.id;
            }),
            ce.saveFormatedGroupMessage(t, e),
            !r && o)
          ) {
            const e = qn(t, n);
            re("sendMessage", e);
          }
        }
        o && re("onUnreadChange", t);
      });
      const Go = (e) => {
          let t = !1;
          const n = Lo(e, D.READ);
          if (e && n) {
            const n = z.getUid(),
              r = U(e.from);
            r > 0 && r != n && e.config && e.config.groupMemberList && (t = !0);
          }
          return t;
        },
        Lo = (e, t) => {
          let n = !1;
          if (e && e.status != t) {
            const r = e;
            (r.status = t), ce.saveGroupMessage(L(r)), (n = !0);
          }
          return n;
        },
        Po = (e, t) => {
          let n = [];
          (n = t ? ce.getGroupMessage(e) : ce.getRosterMessage(e)),
            n.length > 0 && ie.saveRecent(n[n.length - 1]);
        };
      te("onActionMessage", (e) => {
        const { payload: t, from: n, to: r, isReceived: o } = e,
          { type: i, operation: s = {} } = t,
          a = z.getUid() + "",
          u = r ? G(r.uid) : 0,
          c = G(n.uid),
          d = a + "" == c + "" ? u : c,
          l = -1 != K.getJoinedGroups().indexOf(u - 0);
        if (i !== N.OPER) return;
        const { type: p, mid: f, xid: h } = s;
        let g;
        (g = l ? ce.getGroupMessageById(d, f) : ce.getRosterMessageById(d, f)),
          p === b.READ_ACK
            ? (!l && Uo(g), l && Go(g))
            : p === b.DELIVER_ACK
            ? (!l && xo(g, D.DELIVERED), l && Lo(g, D.DELIVERED))
            : p === b.RECALL
            ? (!l && ce.deleteSingleRosterMessage(d, f),
              l && ce.deleteSingleGroupMessage(d, f),
              Po(d, l),
              re("onMessageRecalled", { uid: d, mid: f }))
            : p === b.DELETE
            ? (!l && ce.deleteSingleRosterMessage(h.uid, f),
              l && ce.deleteSingleGroupMessage(h.uid, f),
              Po(h.uid, l),
              re("onMessageDeleted", { uid: h.uid, mid: f }))
            : p === b.READ_CANCEL
            ? (!l && xo(g, D.UNREAD),
              l && Lo(g, D.UNREAD),
              re("onMessageCanceled", { uid: d, mid: f }))
            : p === b.READ_ALL &&
              (l
                ? re("imReadGroupMessage", {
                    group_id: h.uid,
                    mid: f,
                    isReceived: o,
                  })
                : re("imReadRosterMessage", {
                    roster_id: h.uid,
                    mid: f,
                    isReceived: o,
                  }));
        const y = G(h && h.uid ? h.uid : d);
        re("onMessageStatusChanged", { uid: y, mid: G(f) }),
          re("onUnreadChange", y);
      });
      const Bo = {};
      te("swapSendMessage", (e) => {
        const { payload: t } = e,
          { meta: n } = t,
          { id: r } = n;
        Bo[G(r)] = e;
      }),
        te("receivedSendMessage", (e) => {
          e = G(e);
          const t = Bo[e];
          if (t) {
            const e = t.payload,
              { meta: n } = e,
              { payload: r } = n,
              { type: o } = r;
            o === N.OPER && re("onActionMessage", n);
          }
        }),
        te("deleteConversation", ({ id: e, source: t }) => {
          re("flooNotice", {
            category: "conversation_deleted",
            desc: { id: e, source: t },
          });
          const { idx: n, type: r } = ie.getRecentById(e);
          n < 0 ||
            ("group" == r
              ? ce.deleteGroupMessageByGid(e)
              : ce.deleteRosterMessageByRosterId(e),
            ie.deleteRecentById(e));
        });
      var jo = To;
      var Fo = {
        asyncGetGroupInfo: (e, t) => {
          e -= 0;
          const n = K.getGroupInfo(e) || {};
          return n.name && !t
            ? Promise.resolve(n)
            : Eo.groupInfo({ group_id: e }).then(
                (e) => (K.saveGroupInfo([e]), e)
              );
        },
        asyncGetJoinedGroups: (e) =>
          e
            ? Eo.groupUserjoined({}).then((e) =>
                Array.isArray(e) ? e : K.getGroupInfoList()
              )
            : Promise.resolve(K.getGroupInfoList()),
        openGroup: (e) => {
          Eo.groupMemberlist({ group_id: e }).then((t) => {
            K.saveGroupMembers(e, t);
            const n = t.map((e) => e.user_id);
            n.length && jo(e, n, !1, !0), re("onGroupMemberChanged", e);
          });
        },
        getAllGroupDetail: () => K.getAllGroupInfos(),
        asyncGetGroupMembers: (e) =>
          Eo.groupMemberlist({ group_id: e }).then((t) => {
            K.saveGroupMembers(e, t);
            const n = t.map((e) => e.user_id);
            return n.length && jo(e, n, !1, !0), n;
          }),
        getGroupMembers: (e) => K.getGroupMembers(e) || [],
        asyncGetGroupListDetail: (e) =>
          e && e.length
            ? Eo.groupInfoBatch({ group_list: e }).then(
                (e) => (K.saveGroupInfo(e), e)
              )
            : Promise.resolve({}),
        getGruopMessage: (e) => ce.getGroupMessage(e),
        readGroupMessage: (e, t) => {
          re("imReadGroupMessage", { group_id: e, mid: t });
        },
        recallMessage: (e, t) => {
          const n = Vn(e, t);
          re("sendMessage", n), re("swapSendMessage", n);
        },
        getUnreadCount: (e) => ce.getUnreadByGroupId(e),
        asyncGetAdminList: Eo.groupAdminList,
        asyncAdminAdd: Eo.groupAdminAdd,
        asyncAdminRemove: Eo.groupAdminRemove,
        asyncGetAnouncementById: Eo.groupAnnouncement,
        asyncAnouncementDelete: Eo.groupAnnouncementDelete,
        asyncAnnouncementEdit: Eo.groupAnnouncementEdit,
        asyncGetAnnouncementList: Eo.groupAnnouncementList,
        asyncCreate: Eo.groupCreate,
        asyncDestroy: Eo.groupDestroy,
        asyncGetInfo: (e) => (
          e.group_id || (e = { group_id: e }), Eo.groupInfo(e)
        ),
        asyncUpdateAvatar: Eo.groupInfoAvatar,
        asyncUpdateDescription: Eo.groupInfoDdscription,
        asyncUpdateExt: Eo.groupInfoExt,
        asyncUpdateName: Eo.groupInfoName,
        asyncGetMemberList: (e) => (
          e.group_id || (e = { group_id: e }), Eo.groupMemberlist(e)
        ),
        asyncGroupMsgMutemode: Eo.groupMsgMutemode,
        asyncGetPublicList: Eo.groupPubliclist,
        asyncUpdateMsgNotDisturb: Eo.groupMsgNotdisturb,
        asyncGroupBannedList: Eo.groupBannedList,
        asyncGroupBab: Eo.groupBab,
        asyncGroupUnban: Eo.groupUnban,
        asyncGetSettings: Eo.groupSettings,
        asyncUpdateAllowMemberInvitation: Eo.groupSettingsAllowmemberinvitation,
        asyncUpdateAllowMemberModify: Eo.groupSettingsAllowmembermodify,
        asyncUpdateEnableReadack: Eo.groupSettingsEnablereadack,
        asyncUpdateHistoryVisible: Eo.groupSettingsHistoryvisible,
        asyncUpdateRequireadminapproval: Eo.groupSettingsRequireadminapproval,
        asyncBanAll: Eo.groupSettingsBanAll,
        asyncUnBanAll: Eo.groupSettingsUnBanAll,
        asyncOwnerTransfer: Eo.groupTransfer,
        asyncGetUserJoined: Eo.groupUserjoined,
        asyncApply: Eo.groupApply,
        asyncApplyHandle: Eo.groupApplyHandle,
        asyncGroupBockedlist: Eo.groupBockedlist,
        asyncGroupBlock: Eo.groupBlock,
        asyncGroupUnblock: Eo.groupUnblock,
        asyncKick: Eo.groupKick,
        asyncGetInvitationList: Eo.groupInvitationlist,
        asyncInvite: Eo.groupInvite,
        asyncInviteHandle: Eo.groupInviteHandle,
        asyncGetMemberDisplayName: Eo.groupMembersDidpayname,
        asyncLeave: Eo.groupLeave,
        asyncUpdateDisplayName: Eo.groupDisplayname,
        asncGetApplicationList: Eo.groupApplicationlist,
        asyncGetFileList: Eo.groupFilelist,
        asyncFileDelete: Eo.groupFiledelete,
        asyncFileUpload: Eo.groupFileupload,
      };
      var Vo = {
        getToken: () => z.getToken(),
        getUid: () => z.getUid(),
        getAppid: () => z.getAppid(),
        getConversationList: () => ie.getRecents(),
        deleteToken: z.deleteToken,
        getDeviceSN: () => z.getDeviceSN(),
        asyncBindDeviceToken: Eo.bindDeviceToken,
        asyncUnbindDeviceToken: Eo.unbindDeviceToken,
        asyncTokenUser: Eo.tokenUser,
        asyncTokenId: Eo.tokenId,
        asyncRegister: Eo.userRegister,
        asyncUserBindMobile: Eo.userBindMobile,
        asyncUserUpdateMobile: Eo.userUpdateMobile,
        asyncUserSendSms: Eo.userSendSms,
        asyncCaptchaSms: Eo.captchaSms,
        asyncUserNameCheck: Eo.userNameCheck,
        asyncUserMobileBind: Eo.userMobileBind,
        asyncUserMobileBindSign: Eo.userMobileBindSign,
        asyncUserMobileLogin: Eo.userMobileLogin,
        asyncCaptchaImagePost: Eo.captchaImagePost,
        asyncUpdateAuthmode: Eo.userAuthmode,
        asyncUpdateAvatar: Eo.userAvatar,
        asyncUpdateMobile: Eo.userMobile,
        asyncUpdateNickName: Eo.userNickname,
        asyncGetProfile: Eo.userProfile,
        asyncUpdateProfile: Eo.userProfilePost,
        asyncGetSettings: Eo.userSettings,
        asyncUpdateSettings: Eo.userSettingsPost,
      };
      const qo = (e, t) => (t && e ? e + "_" + t : ""),
        Jo = (e) => {
          if (!e) return {};
          const t = Ho("ws"),
            n = Yo(e),
            { clusters: r, clusterIndex: o, ratelIndex: i, fireIndex: s } = n;
          if (!r || !r.length) return {};
          const a = r[o],
            u = a.ratel[i];
          let c;
          if (((c = a.webim ? a.webim[s] : a.ws[s]), !u || !c)) return {};
          const d = u.protocol + "://" + u.host;
          let l = "https";
          l = t ? ("https" === c.protocol ? "wss" : "ws") : c.protocol;
          return { ratel: d, fireplace: l + "://" + c.host };
        };
      te("ratelError", () => {
        l.log("Ratel error, should try next in list");
        const e = Ho("app_id");
        ((e) => {
          const t = Yo(e);
          let { clusters: n, clusterIndex: r, ratelIndex: o, fireIndex: i } = t;
          n[r].ratel.length > o + 1
            ? (o++,
              Wo(e, {
                clusters: n,
                clusterIndex: r,
                ratelIndex: o,
                fireIndex: i,
              }))
            : Ko(e);
        })(e);
        const { ratel: t } = Jo(e) || {};
        re("refresh_ratel", t);
      });
      te("fireplaceError", () => {
        const e = Ho("app_id");
        l.log("Fireplace error, should try next in list, appid: ", e),
          ((e) => {
            const t = Yo(e);
            let {
              clusters: n,
              clusterIndex: r,
              ratelIndex: o,
              fireIndex: i,
            } = t;
            const s = n[r];
            let a;
            (a = s.webim ? s.webim : s.ws),
              a.length > i + 1
                ? (i++,
                  Wo(e, {
                    clusters: n,
                    clusterIndex: r,
                    ratelIndex: o,
                    fireIndex: i,
                  }))
                : Ko(e);
          })(e);
        const { fireplace: t } = Jo(e) || {};
        re("refresh_fireplace", t);
      });
      const Ko = (e) => {
          const t = Yo(e);
          let { clusters: n, clusterIndex: r } = t;
          for (; n.length > r + 1; ) {
            r++;
            const t = n[r];
            let o;
            if (((o = t.webim ? t.webim : t.ws), o.length >= 0))
              return void Wo(e, {
                clusters: n,
                clusterIndex: r,
                ratelIndex: 0,
                fireIndex: 0,
              });
          }
          re("retrieve_dns");
        },
        Yo = (e) => F(qo("key_dns_infos", e), !1) || {},
        Wo = (e, t) => {
          j(qo("key_dns_infos", e), t, !1);
        },
        Ho = (e) => (e ? F(qo("key_dns_config", e), !1) : ""),
        Zo = (e, t) => {
          e && t && j(qo("key_dns_config", e), t, !1);
        };
      te("retrieve_dns", () => {
        const e = Ho("dns_server"),
          t = Ho("app_id"),
          n = Ho("ws");
        l.warn("Retrieve DNS for appid: ", t), Xo(e, t, n);
      });
      const Xo = (e, t, n) => {
        Zo("dns_server", e), Zo("app_id", t), Zo("ws", n);
        const r = Jo(t);
        return r.ratel
          ? Promise.resolve(r)
          : be(e, { app_id: t }).then(
              (e) => (
                l.info("DNS SUCCESS: ", e),
                ((e, t) => {
                  if (!e) return {};
                  const { version: n, dns_list: r } = t,
                    o = r.findIndex((e) => 0 == e.group_level);
                  if (o < 0)
                    return (
                      l.error(
                        "DNS ERROR: no available clusters (version:",
                        n,
                        ")"
                      ),
                      {}
                    );
                  const i = {
                    clusters: r[o].clusters,
                    clusterIndex: 0,
                    ratelIndex: 0,
                    fireIndex: 0,
                  };
                  Wo(e, i);
                })(t, e),
                Jo(t)
              )
            );
      };
      var $o = { asyncGetDns: Xo, getServers: Jo };
      const zo = ({ url: e = "", params: t = {} }) => {
          if (!e) return "";
          const n = z.getToken(),
            r = z.getAppid();
          return (
            (t = Object.assign(t, { "access-token": n, app_id: r })),
            e.indexOf("?") > 0 ? (e += "&") : (e += "?"),
            e + he.a.stringify(t)
          );
        },
        Qo = ({ url: e = "", type: t = "", params: n = {} }) => {
          if ((console.log("Download chat file: ", t, " ", e), !e)) return "";
          return Eo.fileDownloadChatFileUrl(e, n, {
            operation: "download_file",
          });
        };
      var ei = {
        getStaticVars: () => r,
        sendRosterMessage: (e) => {
          const t = jn(e),
            n = t.payload.meta;
          ce.saveSendingRosterMessage(n), Eo.sendMessage(t);
          const { id: r } = n;
          return r;
        },
        sendGroupMessage: (e) => {
          const t = Bn(e),
            n = t.payload.meta;
          ce.saveSendingGroupMessage(n), Eo.sendMessage(t);
          const { id: r } = n;
          return r;
        },
        sendMentionMessage: (e) => {
          const t = ((e) => {
              const {
                gid: t,
                txt: n,
                mentionAll: r,
                mentionList: o,
                mentionedMessage: i,
                pushMessage: s,
                senderNickname: a,
              } = e;
              let u = A.TEXT;
              const c = new bn({ uid: z.getUid() - 0, deviceSN: Gn }),
                d = new bn({ uid: t, deviceSN: 0 }),
                l = new Sn();
              l.setCommond(g.SYNC);
              const p = new Dn(),
                f = new wn({
                  from: c,
                  to: d,
                  content: n,
                  ctype: u,
                  type: N.GROUPCHAT,
                });
              f.config = JSON.stringify({
                mentionAll: r,
                mentionList: o,
                mentionedMessage: i,
                pushMessage: s,
                senderNickname: a,
              });
              const h = new Cn({
                id: new Date().getTime(),
                from: c,
                to: d,
                payload: f,
                ns: E.MESSAGE,
              });
              return p.setMeta(h), l.setPayload(p), l;
            })(e),
            n = t.payload.meta;
          ce.saveSendingGroupMessage(n), Eo.sendMessage(t);
        },
        sendInputStatusMessage: (e, t) => {
          const n = ((e, t) => {
            let n = A.TEXT;
            const r = new bn({ uid: z.getUid() - 0, deviceSN: Gn }),
              o = new bn({ uid: e - 0, deviceSN: 0 }),
              i = new Sn();
            i.setCommond(g.SYNC);
            const s = new Dn(),
              a = new wn({
                from: r,
                to: o,
                ctype: n,
                type: N.CHAT,
                ext: JSON.stringify({ input_status: t }),
                qos: w.AT_MOST_ONCE,
              }),
              u = new Cn({
                id: new Date().getTime(),
                from: r,
                to: o,
                payload: a,
                ns: E.MESSAGE,
              });
            return s.setMeta(u), i.setPayload(s), i;
          })(e, t);
          Eo.sendMessage(n);
        },
        sendMessage: Eo.sendMessage,
        getNoticeMessage: de.getNotice(),
        getMessageStatus: (e, t, n = !1) => {
          let r = {};
          r = n ? ce.getGroupMessageById(e, t) : ce.getRosterMessageById(e, t);
          const o = Object.keys(D)[r.status];
          return o ? o.toLowerCase() : void 0;
        },
        forwardMessage: function (e) {
          const { uid: t, mid: n, gid: r } = e;
          let o = void 0;
          o = t ? ce.getRosterMessageById(t, n) : ce.getGroupMessageById(r, n);
          const i = o.attach;
          if (i && i.url) {
            let e = i.url.split("sign=")[1];
            const n = z.getToken();
            Eo.fileForward({
              file_sign: e,
              "access-token": n,
              to_id: (t || r) - 0,
              to_type: t ? 1 : 2,
            }).then((e) => {
              o.attach.url = e;
              const n = Jn(t, r, o),
                i = n.payload.meta;
              t
                ? ce.saveSendingRosterMessage(i)
                : ce.saveSendingGroupMessage(i),
                Eo.sendMessage(n);
            });
          } else {
            const e = Jn(t, r, o),
              n = e.payload.meta;
            t ? ce.saveSendingRosterMessage(n) : ce.saveSendingGroupMessage(n),
              Eo.sendMessage(e);
          }
        },
        asyncFileUpload: (e) =>
          new Promise((t, n) => {
            const {
              group_id: r,
              to_id: o,
              toType: i,
              file: s,
              fileType: a,
              chatType: u,
            } = e;
            let c = "";
            c =
              "rosterAvatar" === i
                ? "fileUploadAvatarUrl"
                : "chat" == i
                ? "fileUploadChatFileUrl"
                : "fileUploadGroupAvatarUrl";
            const d = {},
              p = z.getToken();
            "groupAvatar" === i && (d["access-token"] = p);
            a &&
              (d.file_type =
                ["file", "audio", "image", "video", "audio-mp3"].indexOf(a) +
                100),
              d < 100 &&
                (d.file_type =
                  [
                    "shareFile",
                    "shareAudio",
                    "shareImage",
                    "shareVideo",
                  ].indexOf(a) + 200),
              r && (d.group_id = r),
              "group" == u && (d.to_type = 2),
              "roster" == u && (d.to_type = 1),
              o && (d.to_id = o),
              Eo[c](d)
                .then((e) => {
                  let n = { filePath: s, name: "file" };
                  e.oss_body_param &&
                    e.oss_body_param.key &&
                    (n = Object.assign(n, {
                      formData: {
                        OSSAccessKeyId: e.oss_body_param.OSSAccessKeyId,
                        policy: e.oss_body_param.policy,
                        signature: e.oss_body_param.signature,
                        callback: e.oss_body_param.callback,
                        key: e.oss_body_param.key,
                      },
                    }));
                  Eo.asyncFileUpload(e.upload_url, n, {
                    operation: "upload_file",
                  })
                    .then(() => {
                      t({ url: e.download_url });
                    })
                    .catch((e) => {
                      l.error("Fail to upload file due to ", e);
                    });
                })
                .catch((e) => {
                  n(e);
                });
          }),
        requireHistoryMessage: (e, t, n) => {
          const r = ((e, t, n) => {
            t = x(t);
            const r = new Sn();
            r.setCommond(g.SYNC);
            const o = new bn({ uid: U(e), deviceSN: 0 }),
              i = new Dn();
            return (
              i.setXid(o),
              i.setKey(U(t)),
              i.setFullsyncnum(n),
              i.setIsfullsync(!0),
              r.setPayload(i),
              r
            );
          })(e, t, n);
          Eo.sendMessage(r);
        },
        makeSearch: (e) => {
          const t = [],
            n = [];
          (pe.getRosterInfoList() || []).forEach((n) => {
            let r = !1;
            const { user_id: o, username: i, avatar: s } = n;
            (ce.getRosterMessage(o) || []).forEach((n) => {
              if (r) return;
              const { payload: a = {} } = n,
                { content: u = "" } = a;
              u.indexOf(e) >= 0 &&
                ((r = !0),
                t.push({ user_id: o, username: i, avatar: s, content: u }));
            }),
              r ||
                (i.indexOf(e) >= 0 &&
                  t.push({ user_id: o, username: i, avatar: s }));
          });
          return (
            K.getGroupInfoList().forEach((t) => {
              let r = !1;
              const { group_id: o, name: i } = t;
              (ce.getGroupMessage(o) || []).forEach((t) => {
                if (r) return;
                const { payload: s = {} } = t,
                  { content: a = "" } = s;
                a.indexOf(e) >= 0 &&
                  ((r = !0), n.push({ group_id: o, name: i, content: a }));
              }),
                r || (i.indexOf(e) >= 0 && n.push({ group_id: o, name: i }));
            }),
            { rosterArr: t, groupArr: n }
          );
        },
        asyncGetUserAvatarUploadUrl: Eo.fileUploadAvatarUrl,
        asyncGetGroupAvatarUploadUrl: Eo.fileUploadGroupAvatarUrl,
        asyncGetFileUploadChatFileUrl: Eo.fileUploadChatFileUrl,
        asyncQrcode: Eo.qrcode,
        asyncQrlogin: Eo.qrlogin,
        asyncQrcodeGroupsign: Eo.qrcodeGroupsign,
        asyncQrcodeGroupinvite: Eo.qrcodeGroupinvite,
        asyncWxlogin: Eo.wxlogin,
        asyncWxbind: Eo.wxbind,
        asyncGetStaticContact: Eo.getStaticContact,
        getImage: ({
          avatar: e = "",
          type: t = "roster",
          thumbnail: n = !0,
          sdefault: r = "",
        }) => {
          if (/^\//.test(e)) return e;
          if (!e)
            return "roster" === t
              ? r || "/static/image/roster.png"
              : r || "/static/image/group.png";
          let o = e,
            i = {};
          if (0 !== e.indexOf("http")) {
            const t = z.getAppid();
            let { ratel: n } = $o.getServers(t) || {};
            !/\/$/.test(n) && n.length > 5 && (o = n + "/file/download/avatar"),
              (i = Object.assign(i, { object_name: e }));
          }
          return (
            n && (i = Object.assign(i, { image_type: 2 })),
            zo({ url: o, type: "image", params: i })
          );
        },
        getAudio: ({ url: e, type: t = "audio" }) =>
          zo({ url: e, type: t, params: { format: "mp3" } }),
        getChatFile: zo,
        downloadAudio: ({ url: e = "", type: t = "audio" }) =>
          Qo({ url: e, type: t, params: { format: "mp3" } }),
        getServers: $o.getServers,
        asyncWechatUnbind: Eo.wechatUnbind,
        asyncWechatIsbind: Eo.wechatIsbind,
        asyncWechatBind: Eo.wechatBind,
        deleteConversation: function (e, t = !0) {
          re("deleteConversation", {
            id: e,
            other_devices: t,
            source: "user_operation",
          });
          const n = ((e, t = !0) => {
            let n = T.DELETE;
            t && (n = T.DELETE_EVERYWHERE);
            const r = new bn({ uid: z.getUid() - 0, deviceSN: Gn }),
              o = new bn({ uid: e }),
              i = new xn({ type: R.OPER, operation: { xid: o, type: n } }),
              s = new Cn({
                id: new Date().getTime(),
                from: r,
                payload: i,
                ns: E.CONVERSATION,
              }),
              a = new Dn();
            a.setMeta(s);
            const u = new Sn();
            return u.setCommond(g.SYNC), u.setPayload(a), u;
          })(e, t);
          Eo.sendMessage(n);
        },
      };
      let ti = {},
        ni = null,
        ri = !1,
        oi = !1;
      const ii = function ({
          autoLogin: e = !0,
          dnsServer: t = "https://dns.lanyingim.com/v2/app_dns",
          appid: n = "welovemaxim",
          ws: r = !1,
          logLevel: o = "debug",
        }) {
          l.setLogLevel(o),
            z.saveAppid(n),
            $o
              .asyncGetDns(t, n, r)
              .then((r) => {
                const { ratel: o, fireplace: i } = r;
                if (!o || !i)
                  return (
                    l.log("DNS error, check the server: ", t),
                    void re("flooError", { category: "DNS_FAILED", desc: t })
                  );
                if (
                  (si(n),
                  (ti = { appid: n, baseUrl: o, autoLogin: e, fireplace: i }),
                  (ii.baseUrl = ti.baseUrl),
                  (ri = !0),
                  ni)
                ) {
                  const { type: e } = ni;
                  return (
                    "login" == e && ii.login(ni.opt),
                    "qrlogin" == e && ii.qrlogin(ni.opt),
                    void (
                      "tokenLogin" == e && ii.tokenLogin(ni.user_id, ni.token)
                    )
                  );
                }
                if (ti.autoLogin) {
                  oi = !0;
                  const e = z.getUid(),
                    t = z.getToken();
                  if (e && t) {
                    const e = No.asyncGetRosterIdList(!0),
                      t = Fo.asyncGetJoinedGroups(!0);
                    Promise.all([e, t])
                      .then((e) => {
                        const t = e[0],
                          n = e[1];
                        re("imRostersGroupslistReady", {
                          rosters: t,
                          groups: n,
                        }),
                          l.log("get roster, group over .... will io connect"),
                          Eo.connect(ti);
                      })
                      .catch((e) => {
                        re("flooNotice", {
                          category: "loginMessage",
                          desc: "get roster list failure:" + e.message,
                        });
                      });
                  }
                }
              })
              .catch((e) => {
                console.log("flooim init error, please retry later: ", e);
              });
        },
        si = function (e) {
          l.log("setup servers for app: ", e);
          const { ratel: t, fireplace: n } = $o.getServers(e) || {};
          re("refresh_ratel", t), re("refresh_fireplace", n);
        };
      (ii.login = function (e) {
        console.log("webim.login", e, "sdkOk:", ri),
          ri
            ? (re("flooNotice", {
                category: "loginMessage",
                desc: "getting token...",
              }),
              Eo.tokenUser(e)
                .then((e) => {
                  const { token: t, user_id: n, public_key: r } = e;
                  z.saveUid(n), z.saveToken(t), z.saveAesKey(r);
                  const o = No.asyncGetRosterIdList(!0),
                    i = Fo.asyncGetJoinedGroups(!0);
                  console.log("Get token success"),
                    (oi = !0),
                    re("flooNotice", {
                      category: "loginMessage",
                      desc: "token sucecc, getting roster lists..",
                    }),
                    Promise.all([o, i])
                      .then((e) => {
                        const r = e[0],
                          o = e[1];
                        re("imRostersGroupslistReady", {
                          rosters: r,
                          groups: o,
                        }),
                          l.log("get roster, group over .... will io connect"),
                          (ti = Object.assign({ uid: n, token: t }, ti)),
                          Eo.connect(ti),
                          (ni = null);
                      })
                      .catch((e) => {
                        re("flooNotice", {
                          category: "loginMessage",
                          desc: "get roster list failure:" + e.message,
                        });
                      });
                })
                .catch((e) => {
                  re("loginFail", "token failure:" + e.message);
                }))
            : (ni = { type: "login", opt: e });
      }),
        (ii.qrlogin = function (e) {
          console.log("webim.qrlogin", e),
            ri
              ? (re("flooNotice", {
                  category: "loginMessage",
                  desc: "getting token...",
                }),
                Eo.tokenId(e)
                  .then((e) => {
                    const { token: t, user_id: n, public_key: r } = e;
                    z.saveUid(n), z.saveToken(t), z.saveAesKey(r);
                    const o = No.asyncGetRosterIdList(!0),
                      i = Fo.asyncGetJoinedGroups(!0);
                    re("flooNotice", {
                      category: "loginMessage",
                      desc: "token sucecc, getting roster lists..",
                    }),
                      (oi = !0),
                      Promise.all([o, i])
                        .then((e) => {
                          const r = e[0],
                            o = e[1];
                          re("imRostersGroupslistReady", {
                            rosters: r,
                            groups: o,
                          }),
                            l.log(
                              "get roster, group over .... will io connect"
                            ),
                            (ti = Object.assign({ uid: n, token: t }, ti)),
                            Eo.connect(ti),
                            (ni = null);
                        })
                        .catch((e) => {
                          re("flooNotice", {
                            category: "loginMessage",
                            desc: "get roster list failure:" + e.message,
                          });
                        });
                  })
                  .catch((e) => {
                    re("loginFail", "token failure:" + e.message);
                  }))
              : (ni = { type: "qrlogin", opt: e });
        }),
        (ii.tokenLogin = function (e, t, n) {
          if ((console.log("webim.tokenLogin", e), !ri))
            return void (ni = { type: "tokenLogin", user_id: e, token: t });
          z.saveUid(e), z.saveToken(t), z.saveAesKey(n);
          const r = No.asyncGetRosterIdList(!0),
            o = Fo.asyncGetJoinedGroups(!0);
          re("flooNotice", {
            category: "loginMessage",
            desc: "token sucecc, getting roster lists..",
          }),
            (oi = !0),
            Promise.all([r, o])
              .then((n) => {
                const r = n[0],
                  o = n[1];
                re("imRostersGroupslistReady", { rosters: r, groups: o }),
                  l.log("get roster, group over .... will io connect"),
                  (ti = Object.assign({ uid: e, token: t }, ti)),
                  Eo.connect(ti),
                  (ni = null);
              })
              .catch((e) => {
                re("flooNotice", {
                  category: "loginMessage",
                  desc: "get roster list failure:" + e.message,
                });
              });
        }),
        (ii.idLogin = function (e) {
          Eo.tokenId(e)
            .then((e) => {
              const { token: t, user_id: n, public_key: r } = e;
              z.saveUid(n), z.saveToken(t), z.saveAesKey(r);
              const o = No.asyncGetRosterIdList(!0),
                i = Fo.asyncGetJoinedGroups(!0);
              re("flooNotice", {
                category: "loginMessage",
                desc: "token success, getting roster lists..",
              }),
                (oi = !0),
                Promise.all([o, i])
                  .then((e) => {
                    const r = e[0] || [];
                    r.push(n);
                    const o = e[1];
                    re("imRostersGroupslistReady", { rosters: r, groups: o }),
                      l.log("get roster, group over .... will io connect"),
                      (ti = Object.assign({ uid: n, token: t }, ti)),
                      Eo.connect(ti),
                      (ni = null);
                  })
                  .catch((e) => {
                    re("flooNotice", {
                      category: "loginMessage",
                      desc: "get roster list failure:" + e.message,
                    });
                  });
            })
            .catch((e) => {
              re("loginFail", "token failure:" + e.message);
            });
        }),
        (ii.wxlogin = function () {}),
        (ii.cleanup = function () {
          l.log("FLOO: IM logout, cleanup the data."),
            ie.clear(),
            pe.clear(),
            K.clear(),
            z.clear(),
            ce.clearAll();
        }),
        (ii.isLogin = function () {
          return oi && z.getUid() && z.getToken();
        }),
        (ii.on = ii.listen =
          function (e, t) {
            if (t) te(e, t);
            else {
              Object.keys(e).forEach((t) => {
                te(t, e[t]);
              });
            }
          }),
        (ii.off = function (e, t) {
          if (t) ne(e, t);
          else {
            Object.keys(e).forEach((t) => {
              ne(t, e[t]);
            });
          }
        }),
        (ii.logout = function () {
          Eo.disConnect(), ii.cleanup();
        }),
        (ii.isReady = function () {
          return ri;
        }),
        (ii.setLogLevel = function (e) {
          l.setLogLevel(e);
        }),
        (ii.disConnect = Eo.disConnect);
      var ai = ii;
      function ui(e) {
        return new ai(e), ai;
      }
      (ai.rosterManage = No),
        (ai.groupManage = Fo),
        (ai.userManage = Vo),
        (ai.sysManage = ei);
      t.default = ui;
    },
  ]).default;
});
