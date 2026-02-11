import Link from 'next/link';
import PageLayout from '../../../Components/PageLayout';

const sensorConfig = `rest:
  - resource: "https://pray.ahmedelywa.com/api/prayer-times.json?address=Cairo,Egypt&method=5"
    scan_interval: 3600
    sensor:
      - name: "Prayer Times"
        value_template: "{{ value_json.nextPrayer.name }}"
        json_attributes:
          - timings
          - nextPrayer
          - date
      - name: "Next Prayer"
        value_template: "{{ value_json.nextPrayer.name }}"
        json_attributes_path: "$.nextPrayer"
        json_attributes:
          - time
          - minutesUntil
      - name: "Fajr Time"
        value_template: "{{ value_json.timings.Fajr }}"
      - name: "Dhuhr Time"
        value_template: "{{ value_json.timings.Dhuhr }}"
      - name: "Asr Time"
        value_template: "{{ value_json.timings.Asr }}"
      - name: "Maghrib Time"
        value_template: "{{ value_json.timings.Maghrib }}"
      - name: "Isha Time"
        value_template: "{{ value_json.timings.Isha }}"`;

const automationConfig = `automation:
  - alias: "Prayer Time Notification"
    trigger:
      - platform: template
        value_template: >
          {{ now().strftime('%H:%M') == states('sensor.fajr_time') }}
      - platform: template
        value_template: >
          {{ now().strftime('%H:%M') == states('sensor.dhuhr_time') }}
      - platform: template
        value_template: >
          {{ now().strftime('%H:%M') == states('sensor.asr_time') }}
      - platform: template
        value_template: >
          {{ now().strftime('%H:%M') == states('sensor.maghrib_time') }}
      - platform: template
        value_template: >
          {{ now().strftime('%H:%M') == states('sensor.isha_time') }}
    action:
      - service: notify.mobile_app_your_phone
        data:
          title: "Prayer Time"
          message: "It's time for {{ states('sensor.next_prayer') }} prayer"`;

const advancedAutomation = `automation:
  - alias: "Pre-Prayer Reminder"
    trigger:
      - platform: template
        value_template: >
          {{ state_attr('sensor.next_prayer', 'minutesUntil') | int == 15 }}
    action:
      - service: light.turn_on
        target:
          entity_id: light.prayer_room
        data:
          brightness_pct: 100
          color_temp_kelvin: 4000
      - service: tts.speak
        target:
          entity_id: tts.google_translate_say
        data:
          message: "{{ states('sensor.next_prayer') }} prayer in 15 minutes"`;

const lovelaceCard = `type: entities
title: Prayer Times
entities:
  - entity: sensor.next_prayer
    name: Next Prayer
    icon: mdi:mosque
  - entity: sensor.fajr_time
    name: Fajr
    icon: mdi:weather-night
  - entity: sensor.dhuhr_time
    name: Dhuhr
    icon: mdi:white-balance-sunny
  - entity: sensor.asr_time
    name: Asr
    icon: mdi:weather-sunset
  - entity: sensor.maghrib_time
    name: Maghrib
    icon: mdi:weather-sunset-down
  - entity: sensor.isha_time
    name: Isha
    icon: mdi:moon-waning-crescent`;

export default function HomeAssistantPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-screen-lg px-4 py-8">
        <div className="mb-8">
          <Link
            href="/api-docs"
            className="mb-4 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary"
          >
            &larr; Back to API Docs
          </Link>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-text-primary">
            <span className="text-2xl">🏠</span>
            Home Assistant Integration
          </h1>
          <p className="mt-2 text-text-secondary">
            Integrate prayer times into your smart home with Home Assistant RESTful sensors.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">Overview</h2>
          <p className="text-sm text-text-secondary">
            This guide shows how to set up prayer time sensors in Home Assistant using the PrayCalendar JSON API. You
            can use these sensors to:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-text-secondary">
            <li>Display prayer times on your Home Assistant dashboard</li>
            <li>Send notifications when it&apos;s time to pray</li>
            <li>Automate lights, speakers, or other devices before prayer times</li>
            <li>Show countdown to next prayer</li>
          </ul>
        </section>

        {/* Basic Setup */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">1. Basic Sensor Setup</h2>
          <p className="mb-3 text-sm text-text-secondary">
            Add the following to your{' '}
            <code className="rounded bg-bg-secondary px-1 font-mono text-xs text-gold">configuration.yaml</code>:
          </p>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-bg-secondary px-4 py-3 font-mono text-xs text-text-secondary">
            {sensorConfig}
          </pre>
          <p className="mt-3 text-sm text-text-muted">
            Replace <code className="rounded bg-bg-secondary px-1 font-mono text-xs">Cairo,Egypt</code> with your city
            and <code className="rounded bg-bg-secondary px-1 font-mono text-xs">method=5</code> with your preferred{' '}
            <Link href="/api-docs" className="text-teal underline">
              calculation method
            </Link>
            .
          </p>
        </section>

        {/* Dashboard Card */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">2. Dashboard Card</h2>
          <p className="mb-3 text-sm text-text-secondary">Add an Entities card to your Lovelace dashboard:</p>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-bg-secondary px-4 py-3 font-mono text-xs text-text-secondary">
            {lovelaceCard}
          </pre>
        </section>

        {/* Automation */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">3. Prayer Time Notifications</h2>
          <p className="mb-3 text-sm text-text-secondary">
            Create an automation to send mobile notifications at prayer times:
          </p>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-bg-secondary px-4 py-3 font-mono text-xs text-text-secondary">
            {automationConfig}
          </pre>
          <p className="mt-3 text-sm text-text-muted">
            Replace <code className="rounded bg-bg-secondary px-1 font-mono text-xs">mobile_app_your_phone</code> with
            your actual mobile app notify service.
          </p>
        </section>

        {/* Advanced */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">4. Advanced: Pre-Prayer Automation</h2>
          <p className="mb-3 text-sm text-text-secondary">
            Use the <code className="rounded bg-bg-secondary px-1 font-mono text-xs text-gold">minutesUntil</code>{' '}
            attribute to trigger actions before prayer time:
          </p>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-bg-secondary px-4 py-3 font-mono text-xs text-text-secondary">
            {advancedAutomation}
          </pre>
        </section>

        {/* Tips */}
        <section className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">Tips</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-text-secondary">
            <li>
              Use <code className="rounded bg-bg-secondary px-1 font-mono text-xs text-gold">format=webhook</code> for
              detailed timing data including ISO timestamps and Unix timestamps.
            </li>
            <li>
              The API refreshes every hour (
              <code className="rounded bg-bg-secondary px-1 font-mono text-xs">scan_interval: 3600</code>). Adjust as
              needed, but avoid polling too frequently.
            </li>
            <li>
              Add <code className="rounded bg-bg-secondary px-1 font-mono text-xs text-gold">qibla=true</code> to
              include Qibla direction in the response.
            </li>
            <li>
              For coordinates-based location, use{' '}
              <code className="rounded bg-bg-secondary px-1 font-mono text-xs">latitude=...&longitude=...</code> instead
              of address.
            </li>
            <li>
              Check the{' '}
              <Link href="/api-docs" className="text-teal underline">
                API Documentation
              </Link>{' '}
              for all available parameters.
            </li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
