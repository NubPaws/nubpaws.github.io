/**
 * This code is a modification of the answer provided by PhD AP EcE
 * at https://stackoverflow.com/a/32593825/3097239.
 * 
 * Modifications made by [Your Name or Handle].
 * 
 * Licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
 * You must give appropriate credit to the original author and to the modifier, and share any derived code
 * under the same license.
 * 
 * Full license details: https://creativecommons.org/licenses/by-sa/4.0/
 */
#ifndef THREAD_POOL_HPP
#define THREAD_POOL_HPP

#include <thread>
#include <mutex>
#include <functional>
#include <condition_variable>
#include <queue>
#include <array>
#include <optional>
#include <tuple>

template<size_t threadCount, typename... Args>
class ThreadPool {
public:
	typedef std::function<void(Args...)> Function;
	
	struct Job {
		Function task;
		std::tuple<Args...> args;
		
		void call() {
			std::apply(task, args);
		}
	};
private:
	// This will tell the threads to stop looking for jobs to execute.
	bool shouldTerminate = false;
	
	// Will be used to prevent data races to the job queue.
	std::mutex queueMutex;
	std::condition_variable mutexCondition;
	
	std::array<threadCount, std::thread> threads;
	std::queue<Job> jobs;
	
public:
	ThreadPool() = default;
	
	~ThreadPool() {
		join();
	}
	
	void start() {
		for (size_t i = 0; i < threadCount; i++) {
			threads[i] = std::thread(&ThreadPool::loop, this);
		}
	}
	
	void queue(const Function& func, Args... args) {
		std::unique_lock<std::mutex> lock(queueMutex);
		
		Job job = { func, std::forward_as_tuple(std::forward<Args>(args)...) };
		jobs.push(job);
	}
	
	/**
	 * Tells the thread pool to stop executing.
	 */
	void join() {
		if (shouldTerminate) {
			return;
		}
		
		std::unique_lock<std::mutex> lock(queueMutex);
		shouldTerminate = true;
		lock.unlock();
		
		mutexCondition.notify_all();
		for (std::thread& activeThread : threads) {
			activeThread.join();
		}
	}
	
	/**
	 * Checks if there are jobs waiting to be executed.
	 */
	bool busy() {
		return !jobs.empty();
	}
	
private:
	/**
	 * The main thread loop that each thread will run in which they will
	 * check if there are new jobs.
	 * If there are new jobs, start executing them, if there aren't wait
	 * until there are.
	 */
	void loop() {
		while (true) {
			std::optional<Job> job = getNextJob();
			
			if (!job.has_value()) {
				break; // out of the while loop.
			}
			
			job.value().call();
		}
	}
	
	std::optional<Job> getNextJob() {
		std::unique_lock<std::mutex> lock(queueMutex);
		mutexCondition.wait(lock, [this] {
			return !jobs.empty() || shouldTerminate;
		});
		
		if (shouldTerminate) {
			return std::nullopt;
		}
		
		Job job = jobs.front();
		jobs.pop();
		
		return job;
	}
	
};

#endif // THREAD_POOL_HPP
