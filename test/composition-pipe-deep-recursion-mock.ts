export const largeSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Comprehensive E-Commerce Platform Schema',
  description:
    'A large, realistic JSON Schema for an e-commerce platform, fully self-contained (no $refs).',
  type: 'object',
  properties: {
    users: {
      type: 'array',
      description: 'List of registered users in the system.',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            pattern: '^[a-f0-9]{24}$',
          },
          username: {
            type: 'string',
            minLength: 3,
            maxLength: 30,
          },
          email: {
            type: 'string',
            format: 'email',
          },
          passwordHash: {
            type: 'string',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          lastLogin: {
            type: 'string',
            format: 'date-time',
          },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['customer', 'admin', 'vendor', 'support'],
            },
          },
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                state: {
                  type: 'string',
                },
                postalCode: {
                  type: 'string',
                },
                country: {
                  type: 'string',
                },
              },
              required: ['street', 'city', 'postalCode', 'country'],
            },
          },
          preferences: {
            type: 'object',
            properties: {
              newsletter: {
                type: 'boolean',
              },
              currency: {
                type: 'string',
                enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'],
              },
              language: {
                type: 'string',
                pattern: '^[a-z]{2}-[A-Z]{2}$',
              },
            },
          },
        },
        required: ['id', 'username', 'email', 'createdAt'],
      },
    },
    products: {
      type: 'array',
      description: 'All products available in the catalog.',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            pattern: '^[A-Z0-9]{8,12}$',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
          price: {
            type: 'number',
            minimum: 0,
          },
          currency: {
            type: 'string',
            enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'],
          },
          stock: {
            type: 'integer',
            minimum: 0,
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          dimensions: {
            type: 'object',
            properties: {
              width: {
                type: 'number',
              },
              height: {
                type: 'number',
              },
              depth: {
                type: 'number',
              },
              weight: {
                type: 'number',
              },
            },
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uri',
            },
          },
          rating: {
            type: 'number',
            minimum: 0,
            maximum: 5,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['id', 'name', 'price', 'currency', 'stock'],
      },
    },
    orders: {
      type: 'array',
      description: 'Customer purchase orders.',
      items: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
          },
          userId: {
            type: 'string',
            pattern: '^[a-f0-9]{24}$',
          },
          status: {
            type: 'string',
            enum: [
              'pending',
              'paid',
              'shipped',
              'delivered',
              'cancelled',
              'refunded',
            ],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                },
                quantity: {
                  type: 'integer',
                  minimum: 1,
                },
                unitPrice: {
                  type: 'number',
                  minimum: 0,
                },
                total: {
                  type: 'number',
                  minimum: 0,
                },
              },
              required: ['productId', 'quantity', 'unitPrice', 'total'],
            },
          },
          shipping: {
            type: 'object',
            properties: {
              carrier: {
                type: 'string',
              },
              trackingNumber: {
                type: 'string',
              },
              estimatedDelivery: {
                type: 'string',
                format: 'date',
              },
              address: {
                type: 'object',
                properties: {
                  street: {
                    type: 'string',
                  },
                  city: {
                    type: 'string',
                  },
                  state: {
                    type: 'string',
                  },
                  postalCode: {
                    type: 'string',
                  },
                  country: {
                    type: 'string',
                  },
                },
              },
            },
          },
          payment: {
            type: 'object',
            properties: {
              method: {
                type: 'string',
                enum: ['card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
              },
              transactionId: {
                type: 'string',
              },
              amount: {
                type: 'number',
                minimum: 0,
              },
              currency: {
                type: 'string',
                enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'],
              },
              status: {
                type: 'string',
                enum: ['pending', 'completed', 'failed', 'refunded'],
              },
            },
            required: ['method', 'amount', 'currency', 'status'],
          },
        },
        required: [
          'orderId',
          'userId',
          'status',
          'createdAt',
          'items',
          'payment',
        ],
      },
    },
    reviews: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          reviewId: {
            type: 'string',
          },
          productId: {
            type: 'string',
          },
          userId: {
            type: 'string',
          },
          rating: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
          },
          comment: {
            type: 'string',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['reviewId', 'productId', 'userId', 'rating', 'createdAt'],
      },
    },
    inventory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          warehouseId: {
            type: 'string',
          },
          location: {
            type: 'string',
          },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                },
                quantity: {
                  type: 'integer',
                  minimum: 0,
                },
                reserved: {
                  type: 'integer',
                  minimum: 0,
                },
              },
            },
          },
        },
        required: ['warehouseId', 'location', 'products'],
      },
    },
    discounts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          percentage: {
            type: 'number',
            minimum: 0,
            maximum: 100,
          },
          validFrom: {
            type: 'string',
            format: 'date-time',
          },
          validTo: {
            type: 'string',
            format: 'date-time',
          },
          active: {
            type: 'boolean',
          },
        },
        required: ['code', 'percentage', 'validFrom', 'validTo', 'active'],
      },
    },
    customField_0: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_1: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_2: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_3: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_4: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_5: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_6: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_7: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_8: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_9: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_10: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_11: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_12: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_13: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_14: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_15: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_16: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_17: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_18: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_19: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_20: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_21: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_22: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_23: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_24: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_25: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_26: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_27: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_28: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_29: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_30: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_31: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_32: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_33: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_34: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_35: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_36: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_37: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_38: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_39: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_40: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_41: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_42: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_43: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_44: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_45: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_46: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_47: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_48: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_49: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_50: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_51: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_52: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_53: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_54: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_55: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_56: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_57: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_58: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_59: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_60: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_61: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_62: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_63: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_64: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_65: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_66: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_67: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_68: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_69: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_70: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_71: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_72: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_73: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_74: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_75: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_76: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_77: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_78: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_79: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_80: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_81: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_82: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_83: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_84: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_85: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_86: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_87: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_88: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_89: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_90: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_91: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_92: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_93: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_94: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_95: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_96: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_97: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_98: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_99: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_100: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_101: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_102: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_103: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_104: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_105: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_106: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_107: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_108: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_109: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_110: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_111: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_112: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_113: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_114: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_115: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_116: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_117: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_118: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_119: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_120: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_121: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_122: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_123: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_124: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_125: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_126: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_127: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_128: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_129: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_130: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_131: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_132: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_133: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_134: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_135: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_136: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_137: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_138: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_139: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_140: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_141: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_142: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_143: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_144: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_145: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_146: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_147: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_148: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
    customField_149: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
    },
  },
  required: ['users', 'products', 'orders'],
} as const;
