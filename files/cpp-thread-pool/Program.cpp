#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <numeric>
#include <random>

#include "ThreadPool.hpp"
#include "QueueTS.hpp"

QueueTS<std::string> printQueue;

void partialSum(const std::vector<int>& numbers, size_t start, size_t end, long long& result) {
	result = std::accumulate(numbers.begin() + start, numbers.begin() + end, 0LL);
	
	std::stringstream s;
	s << "Summed from " << start << " to " << end << " and got a total of " << result
		<< " on thread " << std::this_thread::get_id();
	printQueue.push(s.str());
}

void fillWithRandomNumbers(std::vector<int>& numbers) {
	std::random_device rd;
	std::mt19937 gen(rd());
	std::uniform_int_distribution<int> dist(1, 100);
	for (auto& num : numbers) {
		num = dist(gen);
	}
}

int main() {
	const size_t SIZE = 2 << 20;
	std::vector<int> numbers(SIZE);
	
	fillWithRandomNumbers(numbers);
	
	// Create a thread pool with 4 threads.
	ThreadPool<4, const std::vector<int>&, size_t, size_t, long long&> pool;
	
	// We want to split our code into 64 smaller chunks.
	const size_t tasks = 64;
	const size_t taskCount = SIZE / tasks;
	
	std::array<long long, tasks> results;
	for (size_t i = 0; i < tasks; i++) {
		results[i] = 0;
		pool.queue(partialSum, numbers, taskCount * i, taskCount * (i + 1), results[i]);
	}
	
	pool.start();
	while (pool.busy()) {
		std::this_thread::sleep_for(std::chrono::milliseconds(50));
	}
	pool.join();
	
	std::cout << "Result is:     " << std::accumulate(results.begin(), results.end(), 0LL) << "\n";
	std::cout << "Actual sum is: " << std::accumulate(numbers.begin(), numbers.end(), 0LL) << "\n";
	std::cout << "-----------------------------------------------------\n";
	while (!printQueue.empty()) {
		std::cout << printQueue.pop() << "\n";
	}
}
