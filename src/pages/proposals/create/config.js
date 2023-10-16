import I18n from '~/utils/i18n'
export default {
  steps: {
    type: {
      key: 'type',
      index: 1,
      label: I18n.t('proposal-creation.steps.type.label'),
      component: 'step-proposal-type'
    },
    description: {
      key: 'description',
      index: 2,
      label: I18n.t('proposal-creation.steps.description.label'),
      placeholder: I18n.t('proposal-creation.steps.description.placeholder'),
      component: 'step-details'
    },
    date: {
      key: 'date',
      index: 3,
      label: I18n.t('proposal-creation.steps.date.label'),
      component: 'step-duration'
    },
    icon: {
      key: 'icon',
      index: 4,
      label: I18n.t('proposal-creation.steps.icon.label'),
      component: 'step-icon'
    },
    compensation: {
      key: 'compensation',
      index: 5,
      label: I18n.t('proposal-creation.steps.compensation.label'),
      component: 'step-payout'
    },
    review: {
      key: 'review',
      index: 6,
      label: I18n.t('proposal-creation.steps.review.label'),
      component: 'step-review'
    }
  },
  fields: {
    title: {
      key: 'title',
      label: I18n.t('proposal-creation.title'),
      type: 'string',
      placeholder: I18n.t('proposal-creation.typeTheTitleOfYourProposal')
    },
    description: {
      key: 'description',
      label: I18n.t('proposal-creation.description'),
      type: 'markdown',
      placeholder: I18n.t('proposal-creation.pleaseStateTheReasonForThisContributionTheMore')
    }
  },
  types: {
    community: {
      options: {
        badge: {
          key: 'badge',
          type: 'Assignment Badge',
          icon: 'fas fa-award',
          title: I18n.t('proposal-creation.ability'),
          description: I18n.t('proposal-creation.shareTheDetailsOfThisBadgeAssignment'),
          options: 'badges',
          steps: {
            icon: {
              skip: true
            },
            compensation: {
              skip: true
            }
          },
          fields: {
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.multiply')
            },
            stepDurationTitle: {
              label: I18n.t('proposal-creation.abilityDuration')
            },
            circle: {
              label: I18n.t('proposal-creation.circle'),
              placeholder: I18n.t('proposal-creation.selectACircleFromTheList')
            },
            voiceCoefficient: {
              key: 'voiceCoefficient',
              label: I18n.t('proposal-creation.voiceCoefficient'),
              type: 'percent',
              disabled: true,
              defaultValue: true
            },
            rewardCoefficient: {
              key: 'rewardCoefficient',
              label: I18n.t('proposal-creation.utilityCoefficient'),
              type: 'percent',
              disabled: true,
              defaultValue: true
            },
            pegCoefficient: {
              key: 'pegCoefficient',
              label: I18n.t('proposal-creation.cashCoefficient'),
              type: 'percent',
              disabled: true,
              defaultValue: true
            }
          }
        },
        payout: {
          disable: false,
          key: 'payout',
          icon: 'fas fa-coins',
          type: 'Payout',
          title: I18n.t('proposal-creation.payout'),
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis sem id tincidunt efficitur. Vivamus id risus non erat aliquam molestie ut vitae turpis. ',
          options: {},
          steps: {
            icon: {
              skip: true
            },
            date: {
              skip: true
            }
          },
          fields: {
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.compensation'),
              description: I18n.t('proposal-creation.pleaseEnterTheUSDEquivalentAnd')
            },
            title: {
              key: 'title',
              label: I18n.t('proposal-creation.title'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.typeThePayoutTitle')
            },
            description: {
              key: 'description',
              label: I18n.t('proposal-creation.description'),
              type: 'markdown',
              placeholder: I18n.t('proposal-creation.typeThePayoutDescription')
            },
            url: {
              key: 'url',
              label: I18n.t('proposal-creation.attachments'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.clickToAddFile')
            },
            usdAmount: {
              key: 'usdAmount',
              label: I18n.t('proposal-creation.totalUSDEquivalent'),
              type: 'asset'
            },
            deferred: {
              key: 'deferred',
              label: I18n.t('proposal-creation.chooseTheDeferredAmount'),
              type: 'percent'
            },
            custom: {
              key: 'custom',
              label: I18n.t('proposal-creation.customCompensation'),
              type: 'bool'
            },
            peg: {
              key: 'peg',
              label: I18n.t('proposal-creation.cashToken'),
              type: 'asset'
            },
            reward: {
              key: 'reward',
              label: I18n.t('proposal-creation.utilityToken'),
              type: 'asset'
            },
            voice: {
              key: 'voice',
              label: I18n.t('proposal-creation.voiceToken'),
              type: 'asset'
            }
          }
        },
        poll: {
          disable: false,
          key: 'poll',
          icon: 'fas fa-bars',
          type: 'Poll',
          title: I18n.t('proposal-creation.poll'),
          description: I18n.t('proposal-creation.pollOrSenseCheckWithCommunityMembers'),
          options: {},
          steps: {
            icon: {
              skip: true
            },
            date: {
              skip: true
            },
            compensation: {
              skip: true
            }
          },
          fields: {
            title: {
              key: 'title',
              label: I18n.t('proposal-creation.title'),
              type: 'String',
              placeholder: I18n.t('proposal-creation.useThisFieldToDetailTheContentOfYourPoll')
            },
            description: {
              key: 'description',
              label: I18n.t('proposal-creation.content'),
              type: 'markdown',
              placeholder: I18n.t('proposal-creation.useThisFieldToDetailTheContentOfYourPoll')
            },
            votingMethod: {
              label: I18n.t('proposal-creation.votingMethod'),
              placeholder: I18n.t('proposal-creation.selectVotingMethod'),
              description: ''
            },
            url: {
              key: 'url',
              label: I18n.t('proposal-creation.attachments'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.clickToAddFile')
            }
          }
        }
      }
    },
    core: {
      options: {
        contribution: {
          optionType: 'one-time',
          disable: false,
          key: 'contribution',
          icon: 'far fa-file',
          type: 'Payout',
          title: I18n.t('proposal-creation.contribution'),
          description: I18n.t('proposal-creation.shareTheDetailsOfYoutContribution'),
          options: {},
          steps: {
            date: {
              skip: true
            },
            icon: {
              skip: true
            }
          },
          fields: {
            stepDescriptionTitle: {
              label: I18n.t('proposal-creation.describeYourProposal')
            },
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.chooseYourPayout'),
              description: I18n.t('proposal-creation.pleaseEnterTheUSDEquivalentAnd')
            },
            circle: {
              key: 'circle',
              label: I18n.t('proposal-creation.circle'),
              placeholder: I18n.t('proposal-creation.selectACircleFromTheList')
            },
            url: {
              key: 'url',
              label: I18n.t('proposal-creation.documentation'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.clickToAddFile')
            },
            description: {
              key: 'description',
              label: I18n.t('proposal-creation.description'),
              type: 'markdown',
              placeholder: I18n.t('proposal-creation.pleaseStateTheReasonForThisContributionTheMore')
            },
            usdAmount: {
              key: 'usdAmount',
              label: I18n.t('proposal-creation.totalUSDEquivalent'),
              type: 'asset'
            },
            deferred: {
              key: 'deferred',
              label: I18n.t('proposal-creation.chooseTheDeferredAmount'),
              type: 'percent'
            },
            custom: {
              key: 'custom',
              label: I18n.t('proposal-creation.customCompensation'),
              type: 'bool'
            },
            peg: {
              key: 'peg',
              label: I18n.t('proposal-creation.cashToken'),
              type: 'asset'
            },
            reward: {
              key: 'reward',
              label: I18n.t('proposal-creation.utilityToken'),
              type: 'asset'
            },
            voice: {
              key: 'voice',
              label: I18n.t('proposal-creation.voiceToken'),
              type: 'asset'
            }
          }
        },
        quest: {
          optionType: 'one-time',
          disable: false,
          key: 'quest',
          type: 'Quest',
          title: I18n.t('proposal-creation.quest'),
          icon: 'fa fa-map-marker',
          description: I18n.t('proposal-creation.aQuestIsA2Step'),
          options: 'quests',
          steps: {
            icon: {
              skip: true
            }
          },
          fields: {
            stepDescriptionTitle: {
              label: I18n.t('proposal-creation.createNewQuest')
            },
            title: {
              key: 'title',
              label: I18n.t('proposal-creation.title'),
              placeholder: I18n.t('proposal-creation.typeTheQuestName'),
              type: 'string'
            },
            description: {
              key: 'description',
              label: I18n.t('proposal-creation.description'),
              placeholder: I18n.t('proposal-creation.describeYourQuest'),
              type: 'markdown'
            },
            circle: {
              key: 'circle',
              label: I18n.t('proposal-creation.circle'),
              placeholder: I18n.t('proposal-creation.selectACircleFromTheList')
            },
            url: {
              key: 'url',
              label: I18n.t('proposal-creation.attachments'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.clickToAddFile')
            },
            stepDurationTitle: {
              label: I18n.t('proposal-creation.duration')
            },
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.compensation'),
              description: I18n.t('proposal-creation.pleaseEnterTheUSDEquivalentAnd')
            },
            questType: {
              label: I18n.t('proposal-creation.type'),
              placeholder: I18n.t('proposal-creation.selectQuestType'),
              description: ''
            },
            questMilestone: {
              label: I18n.t('proposal-creation.milestone'),
              placeholder: I18n.t('proposal-creation.selectPreviousQuest'),
              description: ''
            },
            usdAmount: {
              key: 'usdAmount',
              label: I18n.t('proposal-creation.totalUSDEquivalent'),
              type: 'asset'
            },
            deferred: {
              key: 'deferred',
              label: I18n.t('proposal-creation.chooseTheDeferredAmount'),
              type: 'percent'
            },
            custom: {
              key: 'custom',
              label: I18n.t('proposal-creation.customCompensation'),
              type: 'bool'
            },
            peg: {
              key: 'peg',
              label: I18n.t('proposal-creation.cashToken'),
              type: 'asset'
            },
            reward: {
              key: 'reward',
              label: I18n.t('proposal-creation.utilityToken'),
              type: 'asset'
            },
            voice: {
              key: 'voice',
              label: I18n.t('proposal-creation.voiceToken'),
              type: 'asset'
            }
          }
        },
        // TODO: Return after beta
        // poll: {
        //   optionType: 'one-time',
        //   disable: false,
        //   key: 'poll',
        //   icon: 'fas fa-bars',
        //   type: 'Poll',
        //   title: I18n.t('proposal-creation.poll'),
        //   description: I18n.t('proposal-creation.pollOrSenseCheckWithCommunityMembers'),
        //   options: '',
        //   steps: {
        //     icon: {
        //       skip: true
        //     },
        //     date: {
        //       skip: true
        //     },
        //     compensation: {
        //       skip: true
        //     }
        //   },
        //   fields: {
        //     stepDescriptionTitle: {
        //       label: I18n.t('proposal-creation.createNewPoll')
        //     },
        //     title: {
        //       key: 'title',
        //       label: I18n.t('proposal-creation.title'),
        //       type: 'String',
        //       placeholder: I18n.t('proposal-creation.useThisFieldToDetailTheContentOfYourPoll')
        //     },
        //     description: {
        //       key: 'description',
        //       label: I18n.t('proposal-creation.content'),
        //       type: 'markdown',
        //       placeholder: I18n.t('proposal-creation.useThisFieldToDetailTheContentOfYourPoll')
        //     },
        //     votingMethod: {
        //       label: I18n.t('proposal-creation.votingMethod'),
        //       placeholder: I18n.t('proposal-creation.selectVotingMethod'),
        //       description: ''
        //     },
        //     url: {
        //       key: 'url',
        //       label: I18n.t('proposal-creation.attachments'),
        //       type: 'string',
        //       placeholder: I18n.t('proposal-creation.clickToAddFile')
        //     }
        //   }
        // },
        badge: {
          optionType: 'recurring',
          key: 'badge',
          type: 'Assignment Badge',
          icon: 'fas fa-award',
          title: I18n.t('proposal-creation.badge'),
          description: I18n.t('proposal-creation.findHereAvailableBadges'),
          options: 'badges',
          steps: {
            icon: {
              skip: true
            },
            compensation: {
              skip: true
            }
          },
          fields: {
            stepDescriptionTitle: {
              label: I18n.t('proposal-creation.applyForTheNewAbility')
            },
            title: {
              key: 'title',
              label: I18n.t('proposal-creation.name'),
              placeholder: I18n.t('proposal-creation.typeTheAbilityName'),
              type: 'string'
            },
            description: {
              key: 'description',
              label: I18n.t('proposal-creation.description'),
              placeholder: I18n.t('proposal-creation.tellOtherMembersThereReasons'),
              type: 'markdown'
            },
            circle: {
              key: 'circle',
              label: I18n.t('proposal-creation.circle'),
              placeholder: I18n.t('proposal-creation.selectACircleFromTheList')
            },
            url: {
              key: 'url',
              label: I18n.t('proposal-creation.attachments'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.clickToAddFile')
            },
            stepDurationTitle: {
              label: I18n.t('proposal-creation.duration')
            }
          }
        },

        assignment: {
          optionType: 'recurring',
          key: 'assignment',
          icon: 'far fa-user',
          type: 'Assignment',
          title: I18n.t('proposal-creation.role'),
          description: I18n.t('proposal-creation.applyBySelectingARoleArchetype'),
          options: 'archetypes',
          steps: {
            icon: {
              skip: true
            }
          },
          fields: {
            stepDescriptionTitle: {
              label: I18n.t('proposal-creation.applyForTheRole')
            },
            title: {
              key: 'title',
              label: I18n.t('proposal-creation.name'),
              placeholder: I18n.t('proposal-creation.typeTheRoleName'),
              type: 'string'
            },
            description: {
              key: 'description',
              label: I18n.t('proposal-creation.description'),
              placeholder: I18n.t('proposal-creation.typeTheRoleDescription'),
              type: 'markdown'
            },
            circle: {
              key: 'circle',
              label: I18n.t('proposal-creation.circle'),
              placeholder: I18n.t('proposal-creation.selectACircleFromTheList')
            },
            url: {
              key: 'url',
              label: I18n.t('proposal-creation.attachments'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.clickToAddFile')
            },
            stepDurationTitle: {
              label: I18n.t('proposal-creation.duration')
            },
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.manageYourSalary'),
              description: I18n.t('proposal-creation.fieldsBelowDisplayTheMinimum')
            },
            annualUsdSalaryCustom: {
              key: 'annualUsdSalaryCustom',
              label: I18n.t('proposal-creation.totalUSDEquivalent'),
              type: 'asset'
            },
            commitment: {
              key: 'commitment',
              label: I18n.t('proposal-creation.chooseYourCommitmentLevel'),
              type: 'percent'
            },
            deferred: {
              key: 'deferred',
              label: I18n.t('proposal-creation.chooseTheDeferredAmount'),
              type: 'percent'
            },
            peg: {
              key: 'peg',
              label: I18n.t('proposal-creation.cashToken'),
              type: 'asset'
            },
            reward: {
              key: 'reward',
              label: I18n.t('proposal-creation.utilityToken'),
              type: 'asset'
            },
            voice: {
              key: 'voice',
              label: I18n.t('proposal-creation.voiceToken'),
              type: 'asset'
            }
          }
        },

        obadge: {
          optionType: 'org-assets',
          key: 'obadge',
          type: 'Badge',
          icon: 'fas fa-award',
          title: I18n.t('proposal-creation.badge'),
          options: '',
          description: I18n.t('proposal-creation.badgesGiveCertainRightsAndAccountAbilities'),
          steps: {
            date: {
              skip: true
            },
            compensation: {
              skip: true
            }
          },
          fields: {
            stepDescriptionTitle: {
              label: I18n.t('proposal-creation.createNewBadge')
            },
            title: {
              key: 'title',
              label: I18n.t('proposal-creation.name'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.typeTheBadgeName')
            },
            description: {
              key: 'description',
              label: I18n.t('proposal-creation.description'),
              type: 'markdown',
              placeholder: I18n.t('proposal-creation.typeTheBadgeDescription')
            },
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.tokenMultiplier'),
              description: I18n.t('proposal-creation.badgesProvideAnAdditionalMultiplier')
            },
            voiceCoefficient: {
              key: 'voiceCoefficient',
              label: I18n.t('proposal-creation.voiceCoefficient'),
              type: 'percent',
              defaultValue: true
            },
            rewardCoefficient: {
              key: 'rewardCoefficient',
              label: I18n.t('proposal-creation.utilityCoefficient'),
              type: 'percent',
              defaultValue: true
            },
            pegCoefficient: {
              key: 'pegCoefficient',
              label: I18n.t('proposal-creation.cashCoefficient'),
              type: 'percent',
              defaultValue: true
            }
          }
        },
        // TODO: Return after beta
        // budget: {
        //   optionType: 'org-assets',
        //   disable: false,
        //   key: 'budget',
        //   type: 'Budget',
        //   icon: 'fa fa-hand-holding-usd',
        //   title: I18n.t('proposal-creation.budget'),
        //   description: I18n.t('proposal-creation.requestBudgetAllocation'),
        //   options: '',
        //   steps: {
        //     icon: {
        //       skip: true
        //     },
        //     date: {
        //       skip: true
        //     }
        //   },
        //   fields: {
        //     stepDescriptionTitle: {
        //       label: I18n.t('proposal-creation.createNewBudget')
        //     },
        //     title: {
        //       key: 'title',
        //       label: I18n.t('proposal-creation.title'),
        //       type: 'string',
        //       placeholder: I18n.t('proposal-creation.typeTheBudgetName')
        //     },
        //     description: {
        //       key: 'description',
        //       label: I18n.t('proposal-creation.description'),
        //       type: 'markdown',
        //       placeholder: I18n.t('proposal-creation.typeHereTheContentOfYourBadge')
        //     },
        //     circle: {
        //       label: I18n.t('proposal-creation.circle'),
        //       placeholder: I18n.t('proposal-creation.selectACircleFromTheList')
        //     },
        //     url: {
        //       key: 'url',
        //       label: I18n.t('proposal-creation.attachments'),
        //       type: 'string',
        //       placeholder: I18n.t('proposal-creation.clickToAddFile')
        //     },
        //     usdAmount: {
        //       key: 'usdAmount',
        //       label: I18n.t('proposal-creation.totalUSDEquivalent'),
        //       type: 'asset'
        //     },
        //     deferred: {
        //       key: 'deferred',
        //       label: I18n.t('proposal-creation.chooseTheDeferredAmount'),
        //       type: 'percent'
        //     },
        //     custom: {
        //       key: 'custom',
        //       label: I18n.t('proposal-creation.customCompensation'),
        //       type: 'bool'
        //     },
        //     peg: {
        //       key: 'peg',
        //       label: I18n.t('proposal-creation.cashToken'),
        //       type: 'asset'
        //     },
        //     reward: {
        //       key: 'reward',
        //       label: I18n.t('proposal-creation.utilityToken'),
        //       type: 'asset'
        //     },
        //     voice: {
        //       key: 'voice',
        //       label: I18n.t('proposal-creation.voiceToken'),
        //       type: 'asset'
        //     }
        //   }
        // },
        archetype: {
          key: 'archetype',
          icon: 'far fa-user',
          type: 'Role',
          title: 'Role Archetype',
          description: "Share the details of this Role Archetype by following the policies of this organization. Remember, Roles belong to the organization, Role Assignments belong to you. If you don't know, ask an older member for help.",
          options: '',
          steps: {
            date: {
              skip: true
            },
            icon: {
              skip: true
            }
          },
          fields: {
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.typeTheArchetypeDescription')
            },
            annualUsdSalary: {
              key: 'annualUsdSalary',
              label: I18n.t('proposal-creation.chooseTheSalaryBand'),
              type: 'select',
              options: [
                {
                  label: 'B1 - $70000/year',
                  value: 70000
                },
                {
                  label: 'B2 - $90000/year',
                  value: 90000
                },
                {
                  label: 'B3 - $110000/year',
                  value: 110000
                },
                {
                  label: 'B4 - $130000/year',
                  value: 130000
                },
                {
                  label: 'B5 - $150000/year',
                  value: 150000
                },
                {
                  label: 'B6 - $170000/year',
                  value: 170000
                },
                {
                  label: 'B7 - $190000/year',
                  value: 190000
                }
              ]
            },
            roleCapacity: {
              key: 'roleCapacity',
              type: 'number',
              label: I18n.t('proposal-creation.enterTheRoleCapacity'),
              tooltip: I18n.t('proposal-creation.maximumNumberOfPeopleForThisRole')
            },
            minDeferred: {
              key: 'minDeferred',
              type: 'percent',
              label: I18n.t('proposal-creation.chooseTheMinimumDeferredAmount'),
              tooltip: I18n.t('proposal-creation.minimumRequiredPayedOutAsUtilityToken')
            },
            peg: {
              key: 'peg',
              label: I18n.t('proposal-creation.cashToken'),
              type: 'asset'
            },
            reward: {
              key: 'reward',
              label: I18n.t('proposal-creation.utilityToken'),
              type: 'asset'
            },
            voice: {
              key: 'voice',
              label: I18n.t('proposal-creation.voiceToken'),
              type: 'asset'
            }
          }
        },
        policy: {
          optionType: 'org-assets',
          key: 'policy',
          icon: 'fas fa-shield-alt',
          type: 'Policy',
          title: I18n.t('proposal-creation.policy'),
          options: 'policies',
          description: I18n.t('proposal-creation.policiesCreateRulesThatDAOMembers'),
          steps: {
            date: {
              skip: true
            },
            icon: {
              skip: true
            },
            compensation: {
              skip: true
            }
          },
          fields: {
            stepDescriptionTitle: {
              label: I18n.t('proposal-creation.createNewPolicy')
            },
            title: {
              key: 'title',
              label: I18n.t('proposal-creation.title'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.typeThePolicyName')
            },
            description: {
              key: 'description',
              label: I18n.t('proposal-creation.content'),
              type: 'markdown',
              placeholder: I18n.t('proposal-creation.typeHereTheContentOfYourPolicy')
            },
            circle: {
              label: I18n.t('proposal-creation.circle'),
              placeholder: I18n.t('proposal-creation.selectTheCircleParentOrLeaveItBlank')
            },
            policyType: {
              label: I18n.t('proposal-creation.policyType'),
              placeholder: I18n.t('proposal-creation.selectThePolicyType')
            },
            url: {
              key: 'url',
              label: I18n.t('proposal-creation.attachments'),
              type: 'string',
              placeholder: I18n.t('proposal-creation.clickToAddFile')
            }
          }
        }
      }
    }
  },
  options: {
    contribution: {
      disable: false,
      key: 'contribution',
      icon: 'far fa-file',
      type: 'Payout',
      title: I18n.t('proposal-creation.contribution'),
      description: I18n.t('proposal-creation.shareTheDetailsOfYoutContribution'),
      options: {},
      steps: {
        date: {
          skip: true
        },
        icon: {
          skip: true
        }
      },
      fields: {
        stepDescriptionTitle: {
          label: I18n.t('proposal-creation.describeYourProposal')
        },
        stepCompensationTitle: {
          label: I18n.t('proposal-creation.chooseYourPayout'),
          description: I18n.t('proposal-creation.pleaseEnterTheUSDEquivalentAnd')
        },
        url: {
          key: 'url',
          label: I18n.t('proposal-creation.documentation'),
          type: 'string',
          placeholder: I18n.t('proposal-creation.clickToAddFile')
        },
        description: {
          key: 'description',
          label: I18n.t('proposal-creation.description'),
          type: 'markdown',
          placeholder: I18n.t('proposal-creation.pleaseStateTheReasonForThisContributionTheMore')
        },
        usdAmount: {
          key: 'usdAmount',
          label: I18n.t('proposal-creation.totalUSDEquivalent'),
          type: 'asset'
        },
        deferred: {
          key: 'deferred',
          label: I18n.t('proposal-creation.chooseTheDeferredAmount'),
          type: 'percent'
        },
        custom: {
          key: 'custom',
          label: I18n.t('proposal-creation.customCompensation'),
          type: 'bool'
        },
        peg: {
          key: 'peg',
          label: I18n.t('proposal-creation.cashToken'),
          type: 'asset'
        },
        reward: {
          key: 'reward',
          label: I18n.t('proposal-creation.utilityToken'),
          type: 'asset'
        },
        voice: {
          key: 'voice',
          label: I18n.t('proposal-creation.voiceToken'),
          type: 'asset'
        }
      }
    },
    badgeExtension: {
      disable: false,
      invisible: true,
      key: 'badgeExtension',
      icon: 'far fa-file',
      type: 'badgeExtension',
      title: 'Badge extension',
      options: {},
      steps: {
        date: {
          skip: false
        },
        icon: {
          skip: true
        },
        compensation: {
          skip: true
        }
      },
      fields: {
        stepCompensationTitle: {
          label: I18n.t('proposal-creation.multiply')
        },
        voiceCoefficient: {
          key: 'voiceCoefficient',
          label: I18n.t('proposal-creation.voiceCoefficient'),
          type: 'percent',
          disabled: true,
          defaultValue: true
        },
        rewardCoefficient: {
          key: 'rewardCoefficient',
          label: I18n.t('proposal-creation.utilityCoefficient'),
          type: 'percent',
          disabled: true,
          defaultValue: true
        },
        pegCoefficient: {
          key: 'pegCoefficient',
          label: I18n.t('proposal-creation.cashCoefficient'),
          type: 'percent',
          disabled: true,
          defaultValue: true
        }
      }
    },
    roleExtension: {
      disable: false,
      invisible: true,
      key: 'roleExtension',
      icon: 'far fa-file',
      type: 'roleExtension',
      title: 'Role extension',
      options: {},
      steps: {
        type: {
          skip: true
        },
        description: {
          skip: true
        },
        date: {
          skip: false
        },
        icon: {
          skip: true
        },
        compensation: {
          skip: true
        },
        review: {
          skip: false
        }
      },
      fields: {
        stepCompensationTitle: {
          label: I18n.t('proposal-creation.multiply')
        },
        peg: {
          key: 'peg',
          label: I18n.t('proposal-creation.cashToken'),
          type: 'asset'
        },
        reward: {
          key: 'reward',
          label: I18n.t('proposal-creation.utilityToken'),
          type: 'asset'
        },
        voice: {
          key: 'voice',
          label: I18n.t('proposal-creation.voiceToken'),
          type: 'asset'
        }
      }
    },
    recurring: {
      key: 'recurring',
      disable: false,
      icon: 'far fa-calendar-alt',
      title: 'Recurring activity',
      description: 'This option is a proposal for a recurring activity such as an assignment for a role or badge. It will be automatically converted into a scheduled payout once the proposal passes.',
      steps: {
        icon: {
          skip: true
        }
      },
      options: {
        assignment: {
          key: 'assignment',
          icon: 'far fa-user',
          type: 'Assignment',
          title: 'Role Assignment',
          description: "Share the details of your Role Assignment by following the policies of this organization. If you don't know, ask an older member for help.",
          options: 'archetypes',
          steps: {
            icon: {
              skip: true
            }
          },
          fields: {
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.manageYourSalary'),
              description: I18n.t('proposal-creation.manageYourSalary')
            },
            peg: {
              key: 'peg',
              label: I18n.t('proposal-creation.cashToken'),
              type: 'asset'
            },
            reward: {
              key: 'reward',
              label: I18n.t('proposal-creation.utilityToken'),
              type: 'asset'
            },
            voice: {
              key: 'voice',
              label: I18n.t('proposal-creation.voiceToken'),
              type: 'asset'
            },
            description: {
              key: 'description',
              label: 'Objectives, key results and description',
              type: 'markdown',
              placeholder: I18n.t('proposal-creation.pleaseStateTheReasonForThisContributionTheMore')
            },
            commitment: {
              key: 'commitment',
              label: I18n.t('proposal-creation.chooseYourCommitmentLevel'),
              type: 'percent'
            },
            deferred: {
              key: 'deferred',
              label: I18n.t('proposal-creation.chooseTheDeferredAmount'),
              type: 'percent'
            }
          }
        },
        badge: {
          key: 'badge',
          type: 'Assignment Badge',
          icon: 'fas fa-award',
          title: 'Badge Assignment',
          description: I18n.t('proposal-creation.shareTheDetailsOfThisBadgeAssignment'),
          options: 'badges',
          steps: {
            icon: {
              skip: true
            },
            compensation: {
              skip: true
            }
          },
          fields: {
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.multiply')
            },
            circle: {
              label: I18n.t('proposal-creation.circle'),
              placeholder: I18n.t('proposal-creation.selectACircleFromTheList')
            },
            voiceCoefficient: {
              key: 'voiceCoefficient',
              label: I18n.t('proposal-creation.voiceCoefficient'),
              type: 'percent',
              disabled: true,
              defaultValue: true
            },
            rewardCoefficient: {
              key: 'rewardCoefficient',
              label: I18n.t('proposal-creation.utilityCoefficient'),
              type: 'percent',
              disabled: true,
              defaultValue: true
            },
            pegCoefficient: {
              key: 'pegCoefficient',
              label: I18n.t('proposal-creation.cashCoefficient'),
              type: 'percent',
              disabled: true,
              defaultValue: true
            }
          }
        }
      }
    },
    organization: {
      key: 'organization',
      icon: 'fas fa-briefcase',
      title: 'Organization Asset',
      description: 'Any new asset being created that is providing structure for the organization as a whole.',
      options: {
        archetype: {
          key: 'archetype',
          icon: 'far fa-user',
          type: 'Role',
          title: 'Role Archetype',
          description: "Share the details of this Role Archetype by following the policies of this organization. Remember, Roles belong to the organization, Role Assignments belong to you. If you don't know, ask an older member for help.",
          steps: {
            date: {
              skip: true
            },
            icon: {
              skip: true
            }
          },
          fields: {
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.typeTheArchetypeDescription')
            },
            annualUsdSalary: {
              key: 'annualUsdSalary',
              label: I18n.t('proposal-creation.chooseTheSalaryBand'),
              type: 'select',
              options: [
                {
                  label: 'B1 - $70000/year',
                  value: 70000
                },
                {
                  label: 'B2 - $90000/year',
                  value: 90000
                },
                {
                  label: 'B3 - $110000/year',
                  value: 110000
                },
                {
                  label: 'B4 - $130000/year',
                  value: 130000
                },
                {
                  label: 'B5 - $150000/year',
                  value: 150000
                },
                {
                  label: 'B6 - $170000/year',
                  value: 170000
                },
                {
                  label: 'B7 - $190000/year',
                  value: 190000
                }
              ]
            },
            roleCapacity: {
              key: 'roleCapacity',
              type: 'number',
              label: I18n.t('proposal-creation.enterTheRoleCapacity'),
              tooltip: I18n.t('proposal-creation.maximumNumberOfPeopleForThisRole')
            },
            minDeferred: {
              key: 'minDeferred',
              type: 'percent',
              label: I18n.t('proposal-creation.chooseTheMinimumDeferredAmount'),
              tooltip: I18n.t('proposal-creation.minimumRequiredPayedOutAsUtilityToken')
            },
            peg: {
              key: 'peg',
              label: I18n.t('proposal-creation.cashToken'),
              type: 'asset'
            },
            reward: {
              key: 'reward',
              label: I18n.t('proposal-creation.utilityToken'),
              type: 'asset'
            },
            voice: {
              key: 'voice',
              label: I18n.t('proposal-creation.voiceToken'),
              type: 'asset'
            }
          }
        },
        obadge: {
          key: 'obadge',
          type: 'Badge',
          icon: 'fas fa-award',
          title: 'Badge Type',
          description: "Share the details of this Badge by following the policies of this organization. Generally Badges need to define the Rights, Perks, and Powers that Badge holders receive. Remember, Badges belong to the organization, while Badge Assignments belong to you. If you don't know, ask an older member for help.",
          steps: {
            date: {
              skip: true
            },
            compensation: {
              skip: true
            }
          },
          fields: {
            stepCompensationTitle: {
              label: I18n.t('proposal-creation.tokenMultiplier'),
              description: I18n.t('proposal-creation.badgesProvideAnAdditionalMultiplier')
            },
            purpose: {
              label: I18n.t('proposal-creation.purpose'),
              placeholder: 'This guides the evolution of the badge and is the part that changes the least'
            },
            voiceCoefficient: {
              key: 'voiceCoefficient',
              label: I18n.t('proposal-creation.voiceCoefficient'),
              type: 'percent',
              defaultValue: true
            },
            rewardCoefficient: {
              key: 'rewardCoefficient',
              label: I18n.t('proposal-creation.utilityCoefficient'),
              type: 'percent',
              defaultValue: true
            },
            pegCoefficient: {
              key: 'pegCoefficient',
              label: I18n.t('proposal-creation.cashCoefficient'),
              type: 'percent',
              defaultValue: true
            }
          }
        }
      }
    }
  }
}
