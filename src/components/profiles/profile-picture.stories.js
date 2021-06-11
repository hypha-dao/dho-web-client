import ProfilePicture from './profile-picture.vue'

export default {
  title: 'Profiles/Profile Picture',
  component: ProfilePicture,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProfilePicture },
  template: `
    <profile-picture v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  avatar: 'https://ppp-service-dev-attachmentsbucket-1mf7xzdc3x721.s3.amazonaws.com/protected/us-east-1%3A46e0cef0-f263-4601-b83c-c877fb5998a8/johnnyhypha1-1578417375502.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA5I7ZHHZDKR4NZ3J7%2F20210611%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20210611T174759Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLWVhc3QtMSJHMEUCIQDgjmH1C3pv52Pg2ZmMK2y3AVZq%2BiJPT9WAhNuBPh5NNQIgD1fTWoqOVNKah%2Fif%2FH2eZPeJv%2FaS9hPq1%2FvF6ihSa%2FMqmgYIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw5MTI2NjYzNDUwMzAiDH%2Fvl5RNu2j5fubY3CruBW6hnIDYgxkM2ywHNQlhzM8bOVF%2FteJ5kjOWl3O0IjTq0arGVB0ouuKEEtz%2FDsetQilbr%2FfskXOpYPQzndh8Y4pBQb0%2BCzI9F4LvaqMqj9VsgMMIDnUYs9sfirapj%2FRJUomFUm9t5aA3gR5H0ERmOejeQswu4MyJ0SNSeQbH6anF4X2MenReW5JCAloWl92fpIr%2BZwmgoraXiAZu3CGt48dYOXMjQoPCAxXtFPteHaRlxRSufaKRdjK95Qr%2F6DkG1Ob5qdM6funt8aE4sxh3Oo2GnXJadvUF5ihfhInIVrhvQ9IoWwncnNqgUj%2BLBMpqgrHDXng%2Be5JJa9MF9pvx8o3lb0WZtUybGjAXV4zgfDj0GxHfJsuAlHbe37vqhtKlw%2BVgXZkFAeDz15fPSqHE7oUhvOnG4z%2FoPebhTE4VoRDac9iqKkUnndrfFhg0u5lbYC4xU7En5IpFIKhkyNw2KJ938u%2FS6KMy%2Bwl0hvT7QwQYeZB2C4R3axqyEBUkAkTuqeFpoAMjBU0H34h%2F2zcjdrMZceDk6YwJzjlQwDekLsgAMjmhAzOAj%2FQLaV5sYzFQWzTfYRpo1vwbSMh3P8hnznutQkcM8B6rnDs364dBpvXdlewMEymDrAU9FiL%2Fu2Ri55YrgR0A80fZ8J2lVcw8I2EvBdWZ1en3Hof3HSCf%2B5h6vS0llveYAh7gbsbL%2BjFKrjjBH67d4gV6AewpWF%2F%2BZF1OJSLqGsBmnK4lhPjycBY8p6BpG2QiGNh5MRqEAfXEwk7EY7wXGp2ryRLMUmtcdPut8pLBAt0R29LMy6tpdVAiJE1%2Fs%2FAis5FIu3Dhg%2Bg9Q%2FKHB03TdAr2ZkwlBKEhUlRPdDu42WGQVZDkP0U8C8T1MDNeD3lW%2FZRQHz7nBTO9mnLuRQnEh9Nmj9JucpgCsUaLHmP%2FW0qdCVucLZyAtzFnZeTQ%2BFiW%2FG99ceBzJGgBdawy%2F2jCO0xijdfqY9a28N6eRiAqRQVzX61z3TLXIzDNw46GBjqHAiYK6O5bkMVTen9mfjdnGMrrvWdOF0DnBeZ22y%2FJkUebWPQTMGmoM5GYkTJ4TAjC92F6goVlScuyvlO3pg0liP0JRtQj7OuUfH0Rnv%2FMTiKRxffAhpksgA6NMgZ53ojX6uNOJRMXLbKHjHPvMw%2BUCH07u86eLWe9WJDFOUBcxPXXgdskU1udBPUpvagL%2F82IaO%2BnZ4bQ4kNMoHpeMp6nYrTn49bAVwcq6s3zQjwCm1eBZutCt9wgF5ab0dfvifrfOcWxUk5%2BuGaMY%2FyDoK2p%2BlVZjKOoEhx3WZNFgyitiEJduW3ZyGtGP80A5h4725Qilk0ul1EUxei4VyDWc1qeDSFW6hvgX1Fj&X-Amz-Signature=0640f17e111875d3a9848ed3ee2bfad0eebc0c227eddb6cdca2e188ead23f6f2&X-Amz-SignedHeaders=host',
  size: '200px',
  username: 'johnnyhypha1'
}

export const Base = Template.bind({})
